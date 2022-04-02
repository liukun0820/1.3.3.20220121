define(['jquery', 'bootstrap', 'frontend', 'table', 'form', 'template'], function ($, undefined, Frontend, Table, Form, Template) {

    var Controller = {
		index: function () {
            require(['table'], function (Table) {

                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        index_url: 'userdevice/index',
						add_url: 'userdevice/add',
						edit_url: 'userdevice/edit',
						del_url: 'userdevice/del',
						table: 'userdevice',
                    }
                });

                var table = $("#table");

                // 初始化表格
                table.bootstrapTable({
                    url: $.fn.bootstrapTable.defaults.extend.index_url, // 请求后台的URL
                    sortName: 'id',
					pagination: true, // 是否显示分页
					search: true, // 是否显示搜索
					pageNumber: 1, // 初始化加载第一页，默认第一页
					pageSize: 5, // 每页的记录行数
					pageList: [5, 10, 20, 'all'], // 可供选择的每页的行数
                    showToggle: false, // 是否显示详细视图和列表视图的切换按钮
					showRefresh : true, // 是否显示刷新按钮
					showColumns: true, // 显示隐藏列可以快速切换字段列的显示和隐藏
                    showExport: true, // 是否显示导出按钮
                    fixedColumns: false, // 固定列
                    fixedRightNumber: 1,
					queryParams: function (params) {
						//这里可以动态赋值，比如从URL中获取admin_id的值，filter.admin_id=Fast.api.query('admin_id');
						var imei_id = Fast.api.query('imei_id');
						if(imei_id)
						{
							//这里可以追加搜索条件
							var filter = {};
							var op = {};
							filter.id = imei_id
							op.id = "=";
							params.filter = JSON.stringify(filter);
							params.op = JSON.stringify(op);
						}
						return params;
					}, 
                    columns: [
                        [
                            {field: 'id', title: __('Id'), visible: false}, // visible: false 默认隐藏改列
							{field: 'model', title: __('MODEL'), operate:'LIKE'},
							{field: 'is_disable', 
								title: __('Status'), 
								custom: {"enable": 'success', "disable": 'danger'},
								formatter: Table.api.formatter.status, // status:状态 flag:标志 files:文档 images:图片
								operate: false
							},
							{field: 'user_id', title: __('user_id'), operate: false},
							{field: 'sn', title: __('sn'), operate: false},
							//{field: 'imsi', title: __('imsi'), formatter: paramsThumb, operate: false},
							{field: 'imsi', title: __('imsi'), operate: false},
							{field: 'imei', title: __('IMEI'), 
								formatter: function (value, row, index) {
									//var url = "userdevice/index/imei_id/"+row['imei'];
									var url = "userdevice/index/imei_id/188";
									var title = value;
									return '<a href="' + Fast.api.fixurl(url) + '" class="addtabsit" data-value="' + value + '" title="' + title + '">' + value + '</a>';
								},
								events: Table.api.events.operate,
								operate: false
							},
							{field: 'createtime', title: __('Createtime'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime}, // operate:false 禁用此字段的通用搜索
							{field: 'updatetime', title: __('Updatetime'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime},
							{field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate},
                        ]
                    ],
                });
				// 为表格绑定事件
				Table.api.bindevent(table);
            });
        },
		add: function () {
            Form.api.bindevent($("form[role=form]"));
        },
        edit: function () {
            Form.api.bindevent($("form[role=form]"));
        }
    };

    return Controller;
});
