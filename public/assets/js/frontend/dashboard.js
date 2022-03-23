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

            var pieChart = Echarts.init(document.getElementById('pie-chart'), 'walden');
			var barChart = Echarts.init(document.getElementById('bar-chart'), 'walden');
			$.get('dashboard/index', function (data) {
				pieChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 10,
					},
					series: [
						{
							name: __('Overview'),
							type: 'pie',
							radius: ['50%', '70%'],
							data: data.datas
						}
					]
				});
				barChart.setOption({
					tooltip: {},
					legend: {
						data:[__('Count')]
					},
					xAxis: {
						data: [data.datas[0].name,data.datas[1].name,data.datas[2].name]
					},
					yAxis: {},
					series: [{
						name: __('Count'),
						type: 'bar',
						data: data.datas
					}]
				});
			}, 'json');
        }
    };
    return Controller;
});
