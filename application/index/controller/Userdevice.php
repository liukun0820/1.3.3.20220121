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
    protected $layout = 'default';
	// 数据库过滤字段
	//protected $afd = ['sn','imei','imsi','model','is_disable','user_id'];
	
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
            /* if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            } */
			
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
		$this->view->engine->layout("layout/userdevice"); // 使用这个视图模板文件
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
		$this->view->engine->layout("layout/userdevice"); // 使用这个视图模板文件
        if ($this->request->isPost()) {
            $this->token();
            $params = $this->request->post("row/a");
            if ($params) {
                Db::startTrans();
                try {
                    //$result = $this->model->allowField($this->afd)->save($params);
					$result = $this->model->save($params);
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
		$this->view->engine->layout("layout/userdevice"); // 使用这个视图模板文件
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
                    $result = $this->model->allowField($this->afd)->save($params);
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
			Db::startTrans();
			try {
				$this->model->destroy($ids);
				Db::commit();
			} catch (\Exception $e) {
				Db::rollback();
				$this->error($e->getMessage());
			}
			$this->success();
        }
        $this->error(__('You have no permission'));
    }

}
