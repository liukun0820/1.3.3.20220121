<?php

namespace app\index\controller;

use think\Db;
use app\common\controller\Frontend;
use app\index\model\Userdevice as Userdevicemodel;

class Userdevice extends Frontend
{
	// 不需要验证
    protected $noNeedRight = ['*'];
	// 使用这个视图模板文件
    protected $layout = 'userdevice';
	
	 public function _initialize()
    {
        parent::_initialize();
		$this->model = new Userdevicemodel;
	}

    /**
     * 显示用户设备
     */
    public function index()
    {
		$this->relationSearch = true; // 允许关联
		if ($this->request->isAjax())
        {
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
			
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
					//->with(['user'])
                    ->where($where)
					//->where('user_id', $this->auth->id)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
					//->with(['user'])
                    ->where($where)
					//->where('user_id', $this->auth->id)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            // $list = $this->model->getList('*', $where, $sort, $order, $offset, $limit);

            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
		//$ud = new userdevice;
		//$rst = $ud->paginate(5);
		//$this->view->assign('userdevice', $rst);
		$this->view->assign('title', __('User device'));
		//$this->view->assign(['userdevice' => $rst, 'title' => __('User device')]);
		return $this->view->fetch();
    }
	
	/**
     * 详情
     */
    public function detail($ids)
    {
		//$this->view->engine->layout("layout/userdevice"); // 使用这个视图模板文件
        $row = $this->model->get(['id' => $ids])
			->field('model,imei,sn')->find(); // 过滤需要显示的属性
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        if ($this->request->isAjax()) {
            $this->success("Ajax请求成功", null, ['id' => $ids]);
        }
        $this->view->assign("row", $row->toArray());
        return $this->view->fetch();
    }
	
	/**
     * 添加
     */
    public function add()
    {
		$afd = ['sn','imei','imsi','model','is_disable','user_id'];
        if ($this->request->isPost()) {
            $this->token();
            $params = $this->request->post("row/a");
            if ($params) {
                Db::startTrans();
                try {
                    $result = $this->model->allowField($afd)->save($params);
                    if ($result === false) {
                        exception($this->model->getError());
                    }
                    Db::commit();
                } catch (\Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                $this->success();
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        return $this->view->fetch();
    }

    /**
     * 编辑
     */
    public function edit($ids = null)
    {
        $row = $this->model->get(['id' => $ids]);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        if ($this->request->isPost()) {
            $this->token();
            $params = $this->request->post("row/a");
            if ($params) {
                Db::startTrans();
                try {
                    if ($params['password']) {
                        if (!Validate::is($params['password'], '\S{6,30}')) {
                            exception(__("Please input correct password"));
                        }
                        $params['salt'] = Random::alnum();
                        $params['password'] = md5(md5($params['password']) . $params['salt']);
                    } else {
                        unset($params['password'], $params['salt']);
                    }
                    //这里需要针对username和email做唯一验证
                    $adminValidate = \think\Loader::validate('Admin');
                    $adminValidate->rule([
                        'username' => 'require|regex:\w{3,30}|unique:admin,username,' . $row->id,
                        'email'    => 'require|email|unique:admin,email,' . $row->id,
                        'password' => 'regex:\S{32}',
                    ]);
                    $result = $row->validate('Admin.edit')->save($params);
                    if ($result === false) {
                        exception($row->getError());
                    }

                    // 先移除所有权限
                    model('AuthGroupAccess')->where('uid', $row->id)->delete();


                    //model('AuthGroupAccess')->saveAll($dataset);
                    Db::commit();
                } catch (\Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                $this->success();
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }

        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    /**
     * 删除
     */
    public function del($ids = "")
    {
        if (!$this->request->isPost()) {
            $this->error(__("Invalid parameters"));
        }
        $ids = $ids ? $ids : $this->request->post("ids");
        if ($ids) {
            $ids = array_intersect($this->childrenAdminIds, array_filter(explode(',', $ids)));
            // 避免越权删除管理员
            $childrenGroupIds = $this->childrenGroupIds;
            $adminList = $this->model->where('id', 'in', $ids)->where('id', 'in', function ($query) use ($childrenGroupIds) {
                $query->name('auth_group_access')->where('group_id', 'in', $childrenGroupIds)->field('uid');
            })->select();
            if ($adminList) {
                $deleteIds = [];
                foreach ($adminList as $k => $v) {
                    $deleteIds[] = $v->id;
                }
                $deleteIds = array_values(array_diff($deleteIds, [$this->auth->id]));
                if ($deleteIds) {
                    Db::startTrans();
                    try {
                        $this->model->destroy($deleteIds);
                        model('AuthGroupAccess')->where('uid', 'in', $deleteIds)->delete();
                        Db::commit();
                    } catch (\Exception $e) {
                        Db::rollback();
                        $this->error($e->getMessage());
                    }
                    $this->success();
                }
                $this->error(__('No rows were deleted'));
            }
        }
        $this->error(__('You have no permission'));
    }

}
