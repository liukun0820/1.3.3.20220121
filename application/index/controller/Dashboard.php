<?php

namespace app\index\controller;

use app\common\controller\Frontend;
use app\common\model\Attachment;
use fast\Date;
use think\Db;

// use app\index\model\Quotes;
// use app\index\model\Contacts;
// use app\index\model\Orders;
// use app\index\model\Invoices;

/**
 * 控制台
 *
 * @icon   fa fa-dashboard
 * @remark 用于展示当前系统中的统计数据、统计报表及重要实时数据
 */
class Dashboard extends Frontend
{
	protected $layout = 'default';  // 使用的模板
	protected $noNeedRight = ['*']; // 需要登陆，但是不需要认证，如果打开页面提示没有权限，就是没有添加这个
	
    /**
     * 查看
     */
    public function index()
    {
		$ordercnt = 12;
		$quotecnt = 33;
		$invoicecnt = 55;
		if ($this->request->isAjax()) {
			$result = array("total" => 4, 
						"datas" => [["value" => $ordercnt,"name" => __('Purchase Orders')],
									["value" => $quotecnt,"name" => __('Quotations')],
									["value" => $invoicecnt,"name" => __('Invoices')]]
						);

            return json($result);
		}
		
		$this->view->assign([
			'ordercnt' => $ordercnt,
			'quotecnt' => $quotecnt,
			'invoicecnt' => $invoicecnt
		]);
        return $this->view->fetch();
    }
}
