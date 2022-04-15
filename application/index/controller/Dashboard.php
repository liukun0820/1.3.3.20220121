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
	protected $noNeedLogin = [];
	protected $noNeedRight = [];
	
    /**
     * 查看
     */
    public function index()
    {
		$ordercnt = 12;
		$quotecnt = 33;
		$invoicecnt = 55;

		if ($this->request->isAjax()) {
			$result = array(
				"piebardata" =>
				["total" => 3, 
				"datas" => [["value" => $ordercnt,"url" => "userdevice/index","name" => __('Orders')],
							["value" => $quotecnt,"url" => "userdevice/index","name" => __('Quotations')],
							["value" => $invoicecnt,"url" => "userdevice/index","name" => __('Invoices')]
							]
				],
				"treedata" =>
				["datas" => [["quote1" => ["id" => 1, "order" => ["id" => 2, "traceing" => ["id" => 3, "invoice" => ["id" => 4]]]]],
							["quote2" => ["id" => 5, "order" => ["id" => 6, "traceing" => ["id" => 7, "invoice" => ["id" => 8]]]]],
							["quote3" => ["id" => 9, "order" => ["id" => 10, "traceing" => ["id" => 11, "invoice" => ["id" => 12]]]]]
							]
				]
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
