define(['jquery', 'bootstrap', 'frontend', 'table', 'form', 'template', 'echarts', 'echarts-theme'], function ($, undefined, Frontend, Table, Form, Template, Echarts) {

    var Controller = {
        index: function () {
            //这句话在多选项卡统计表时必须存在，否则会导致影响的图表宽度不正确
            $(document).on("click", ".charts-custom a[data-toggle=\"tab\"]", function () {
                var that = this;
                setTimeout(function () {
                    var id = $(that).attr("href");
                    var chart = Echarts.getInstanceByDom($(id)[0]);
                    chart.resize();
                }, 0);
            });

            const colorList = ["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074",
                               "#546570","#c4ccd3","#4BABDE","#FFDE76","#E43C59","#37A2DA"];
			var pieChart = Echarts.init(document.getElementById('pie-chart'), 'shine');
			var barChart = Echarts.init(document.getElementById('bar-chart'), 'shine');
			$.get('dashboard/index', function (data) {
				pieChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 10,
					},
					series: [
						{
							name: __('Overview'),
							type: 'pie',
							//radius: ['50%', '80%'], // 环形
							data: data.datas
						}
					]
				});
				let idata = [];
				for (let d in data.datas) {
					idata.push(data.datas[d].name);
				}
				barChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{b}: {c}'
					},
					//legend: {
					//	data:[__('Count')]
					//},
					xAxis: {
						data: idata
					},
					yAxis: {},
					series: [{
						name: __('Count'),
						type: 'bar',
						itemStyle: {
						  normal: {
							//这里是重点
							color: function(params) {
							  //给大于颜色数量的柱体添加循环颜色的判断
							  let lindex = params.dataIndex;
							  while (lindex >= colorList.length) {
								  lindex -= colorList.length;
							  }
							  return colorList[lindex]
							}
						  }
						},
						data: data.datas
					}]
				});
			}, 'json');
			pieChart.on('click', function(params) {
				//console.log(params.data.name+' '+params.data.value+' '+params.data.url);
				window.location.href=Fast.api.fixurl(params.data.url);
			});
			barChart.on('click', function(params) {
				//console.log(params.data.name+' '+params.data.value+' '+params.data.url);
				window.location.href=Fast.api.fixurl(params.data.url);
			});
        }
    };
    return Controller;
});
