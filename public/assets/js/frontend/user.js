define(['jquery', 'bootstrap', 'frontend', 'table', 'form', 'template'], function ($, undefined, Frontend, Table, Form, Template) {
    var validatoroptions = {
        invalid: function (form, errors) {
            $.each(errors, function (i, j) {
                Layer.msg(j);
            });
        }
    };
    var Controller = {
        login: function () {

            //本地验证未通过时提示
            $("#login-form").data("validator-options", validatoroptions);

            //为表单绑定事件
            Form.api.bindevent($("#login-form"), function (data, ret) {
                setTimeout(function () {
                    location.href = ret.url ? ret.url : "/";
                }, 1000);
            });

            //忘记密码
            $(document).on("click", ".btn-forgot", function () {
                var id = "resetpwdtpl";
                var content = Template(id, {});
                Layer.open({
                    type: 1,
                    title: __('Reset password'),
                    area: ["450px", "355px"],
                    content: content,
                    success: function (layero) {
                        var rule = $("#resetpwd-form input[name='captcha']").data("rule");
                        Form.api.bindevent($("#resetpwd-form", layero), function (data) {
                            Layer.closeAll();
                        });
                        $(layero).on("change", "input[name=type]", function () {
                            var type = $(this).val();
                            $("div.form-group[data-type]").addClass("hide");
                            $("div.form-group[data-type='" + type + "']").removeClass("hide");
                            $('#resetpwd-form').validator("setField", {
                                captcha: rule.replace(/remote\((.*)\)/, "remote(" + $(this).data("check-url") + ", event=resetpwd, " + type + ":#" + type + ")")
                            });
                            $(".btn-captcha").data("url", $(this).data("send-url")).data("type", type);
                        });
                    }
                });
            });
        },
        register: function () {
            //本地验证未通过时提示
            $("#register-form").data("validator-options", validatoroptions);

            //为表单绑定事件
            Form.api.bindevent($("#register-form"), function (data, ret) {
                setTimeout(function () {
                    location.href = ret.url ? ret.url : "/";
                }, 1000);
            }, function (data) {
                $("input[name=captcha]").next(".input-group-btn").find("img").trigger("click");
            });
        },
        changepwd: function () {
            //本地验证未通过时提示
            $("#changepwd-form").data("validator-options", validatoroptions);

            //为表单绑定事件
            Form.api.bindevent($("#changepwd-form"), function (data, ret) {
                setTimeout(function () {
                    location.href = ret.url ? ret.url : "/";
                }, 1000);
            });
        },
        profile: function () {
            // 给上传按钮添加上传成功事件
            $("#faupload-avatar").data("upload-success", function (data) {
                var url = Fast.api.cdnurl(data.url);
                $(".profile-user-img").prop("src", url);
                Toastr.success(__('Uploaded successful'));
            });
            Form.api.bindevent($("#profile-form"));
            $(document).on("click", ".btn-change", function () {
                var that = this;
                var id = $(this).data("type") + "tpl";
                var content = Template(id, {});
                Layer.open({
                    type: 1,
                    title: "修改",
                    area: ["400px", "250px"],
                    content: content,
                    success: function (layero) {
                        var form = $("form", layero);
                        Form.api.bindevent(form, function (data) {
                            location.reload();
                            Layer.closeAll();
                        });
                    }
                });
            });
        },
        attachment: function () {
            require(['table'], function (Table) {

                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        index_url: 'user/attachment',
                    }
                });
                var urlArr = [];
                var multiple = Fast.api.query('multiple');
                multiple = multiple == 'true' ? true : false;

                var table = $("#table");

                table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                    if (e.type == 'check' || e.type == 'uncheck') {
                        row = [row];
                    } else {
                        urlArr = [];
                    }
                    $.each(row, function (i, j) {
                        if (e.type.indexOf("uncheck") > -1) {
                            var index = urlArr.indexOf(j.url);
                            if (index > -1) {
                                urlArr.splice(index, 1);
                            }
                        } else {
                            urlArr.indexOf(j.url) == -1 && urlArr.push(j.url);
                        }
                    });
                });

                // 初始化表格
                table.bootstrapTable({
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    sortName: 'id',
                    showToggle: false,
                    showExport: false,
                    fixedColumns: true,
                    fixedRightNumber: 1,
                    columns: [
                        [
                            {field: 'state', checkbox: multiple, visible: multiple, operate: false},
                            {field: 'id', title: __('Id'), operate: false},
                            {
                                field: 'url', title: __('Preview'), formatter: function (value, row, index) {
                                    var html = '';
                                    if (row.mimetype.indexOf("image") > -1) {
                                        html = '<a href="' + row.fullurl + '" target="_blank"><img src="' + row.fullurl + row.thumb_style + '" alt="" style="max-height:60px;max-width:120px"></a>';
                                    } else {
                                        html = '<a href="' + row.fullurl + '" target="_blank"><img src="' + Fast.api.fixurl("ajax/icon") + "?suffix=" + row.imagetype + '" alt="" style="max-height:90px;max-width:120px"></a>';
                                    }
                                    return '<div style="width:120px;margin:0 auto;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">' + html + '</div>';
                                }
                            },
                            {
                                field: 'filename', title: __('Filename'), formatter: function (value, row, index) {
                                    return '<div style="width:150px;margin:0 auto;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">' + Table.api.formatter.search.call(this, value, row, index) + '</div>';
                                }, operate: 'like'
                            },
                            {field: 'imagewidth', title: __('Imagewidth'), operate: false},
                            {field: 'imageheight', title: __('Imageheight'), operate: false},
                            {field: 'mimetype', title: __('Mimetype'), formatter: Table.api.formatter.search},
                            {field: 'createtime', title: __('Createtime'), width: 120, formatter: Table.api.formatter.datetime, datetimeFormat: 'YYYY-MM-DD', operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                            {
                                field: 'operate', title: __('Operate'), width: 85, events: {
                                    'click .btn-chooseone': function (e, value, row, index) {
                                        Fast.api.close({url: row.url, multiple: multiple});
                                    },
                                }, formatter: function () {
                                    return '<a href="javascript:;" class="btn btn-danger btn-chooseone btn-xs"><i class="fa fa-check"></i> ' + __('Choose') + '</a>';
                                }
                            }
                        ]
                    ]
                });

                // 选中多个
                $(document).on("click", ".btn-choose-multi", function () {
                    Fast.api.close({url: urlArr.join(","), multiple: multiple});
                });

                // 为表格绑定事件
                Table.api.bindevent(table);
                require(['upload'], function (Upload) {
                    Upload.api.upload($("#toolbar .faupload"), function () {
                        $(".btn-refresh").trigger("click");
                    });
                });

            });
        },
		userdevice: function () {
            require(['table'], function (Table) {

                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        index_url: 'user/userdevice',
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
                    fixedColumns: true,
                    fixedRightNumber: 1,
                    columns: [
                        [
                            {field: 'id', title: __('Id'), cellStyle:formatTableUnit,formatter:paramsMatter, visible: false}, // visible: false 默认隐藏改列
							{field: 'model', title: __('MODEL'), cellStyle:formatTableUnit,formatter:paramsMatter, operate:'LIKE'},
							{field: 'is_disable', title: __('is_disable'), cellStyle:formatTableUnit,formatter:paramsMatter, operate: false},
							{field: 'user_id', title: __('user_id'), cellStyle:formatTableUnit,formatter:paramsMatter, operate: false},
							{field: 'sn', title: __('sn'), cellStyle:formatTableUnit,formatter:paramsMatter, operate: false},
							//{field: 'imsi', title: __('imsi'), formatter: paramsThumb, operate: false},
							{field: 'imsi', title: __('imsi'),
								table: table,
								events: Table.api.events.operate,
								buttons: [
									{
										name: 'detail',
										title: __('点击查看'),
										classname: 'btn btn-xs btn-primary btn-dialog',
										icon: 'fa fa-list',
										url: 'user/userdevicedetail'
									}
								],
								formatter: Table.api.formatter.operate
							},
							{field: 'imei', title: __('IMEI'), cellStyle:formatTableUnit,formatter:paramsMatter, operate: false},
							{field: 'createtime', title: __('createtime'), cellStyle:formatTableUnit,formatter:paramsMatter, operate: false}, // operate:false 禁用此字段的通用搜索
							{field: 'updatetime', title: __('updatetime'), cellStyle:formatTableUnit,formatter:paramsMatter, operate: false},
                        ]
                    ],
					/* onLoadSuccess: function (data) {
						// 弹窗显示页面
						Frontend.api.open("123.124.12.1", "hsdlhf");
						Toastr.info("当前执行的是自定义搜索,搜索URL中包含login的数据");
					} */
                });
				// 为表格绑定事件
				Table.api.bindevent(table);
				
				function paramsThumb(value, row, index) {
                    //return '<div><a href="' + value + '" target="_blank">' + value + '</a></div>';
					Frontend.api.open("123.124.12.1", "hsdlhf");
                }
			
				function paramsMatter(value,row,index, field) {
					var span=document.createElement("span");
					span.setAttribute("title",value);
					span.innerHTML = value;
					return span.outerHTML;
				}

				function formatTableUnit(value, row, index) {
					return {
						css: {
							"white-space": "nowrap",
							"text-overflow": "ellipsis",
							"overflow": "hidden",
							"max-width":"30px"
						}
					}
				}
            });
        },
    };

    return Controller;
});
