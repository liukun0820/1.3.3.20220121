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
			var quoteChart = Echarts.init(document.getElementById('quote-tree-chart'), 'shine');
			var orderChart = Echarts.init(document.getElementById('order-tree-chart'), 'shine');
			
			$.get('dashboard/index', function (data) {
				let idata = [];
				for (let d in data.piebardata.datas) {
					idata.push(data.piebardata.datas[d].name);
				}
				pieChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{b}: {c} ({d}%)'
					},
					/* legend: {
						orient: 'vertical',
						left: 6,
					}, */
					grid: { // 折线图，柱状图，散点图（气泡图）是使用grid（网格）来控制位置的
						top: '10%',
						left: '55%',
						bottom: '10%',
						right: '2%'
					},
					xAxis: {
						data: idata
					},
					yAxis: {},
					series: [
						{
							name: __('Overview'),
							type: 'pie',
							top: '5%',
							left: '5%',
							bottom: '5%',
							right: '50%',
							//radius: ['50%', '80%'], // 环形
							data: data.piebardata.datas
						},
						{
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
							data: data.piebardata.datas
						}
					]
				});
				
				barChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{b}: {c}'
					},
					//legend: {
					//	data:[__('Count')]
					//},
					grid: { // 折线图，柱状图，散点图（气泡图）是使用grid（网格）来控制位置的
						top: '10%',
						left: '10%',
						bottom: '10%',
						right: '10%'
					},
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
						data: data.piebardata.datas
					}]
				});
				const datai = {
 "name": "报价单1",
 "url": "quotes/1",
 "value": 3534,
 "children": [
    {
     "name": "定单1",
	 "url": "invoices/123",
     "children": [
      {
	   "name": "跟踪1", "url":"trasing/123",
	   "children": [
	    {"name": "发票1", "value": 3534, "url":"invoices/123"},
        {"name": "发票2", "value": 5731, "url":"invoices/234"}
	   ]
	  },
      {"name": "跟踪2", "value": 3812, "url":"trasing/234"},
     ]
    },
    {
     "name": "订单2",
	 "url": "invoices/234",
     "children": [
      {"name": "BetweennessCentrality", "value": 3534},
      {"name": "LinkDistance", "value": 5731},
      {"name": "MaxFlowMinCut", "value": 7840},
      {"name": "ShortestPaths", "value": 5914},
      {"name": "SpanningTree", "value": 3416}
     ]
    },
    {
     "name": "订单3",
	 "url": "invoices/345",
     "children": [
      {"name": "AspectRatioBanker", "value": 7074}
     ]
    }
 ]
};
				quoteChart.setOption({
				  tooltip: {
					//borderColor: '#333',
					//backgroundColor: 'rgba(50,50,50,0.7)', //0.7是透明度
					trigger: 'item',
					triggerOn: 'mousemove',
					showContent: true, //是否显示提示框浮层，默认显示。
					enterable: false // 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
				  },
				  series: [
					{
					  type: 'tree',
					  name: '报价单1',
					  data: [datai],
					  top: '5%', // 上边距
					  left: '15%', // 左边距
					  bottom: '5%',
					  right: '20%',
					  symbol: 'emptyCircle', //标记类型包括'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
					  edgeShape: 'curve', //树图在 正交orthogonal布局下，边的形状,分别有曲线和折线两种，对应的取值是 curve 和 polyline
					  symbolSize: 17, //标记(圆点)的大小,可以用数组分开表示宽和高，例如 [20, 10]
					  layout: 'orthogonal', // 树图的布局，有正交orthogonal和径向radial两种
					  orient: 'LR', //只有在 layout = 'orthogonal' 的时候，该配置项才生效，对应有水平方向的从左到右，从右到左；以及垂直方向的从上到下，从下到上。取值分别为 'LR' , 'RL', 'TB', 'BT'
					  roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
					  expandAndCollapse: false, //子树折叠和展开的交互，默认打开
					  initialTreeDepth: null, //树图初始展开的层级（深度）,和折叠展开expandAndCollapse交互一起使用, null 或者 number
					  
					  label: {
						show: true,
						position: 'left',
						verticalAlign: 'middle',
						align: 'right',
						fontSize: 19 // 文字大小
					  },
					  leaves: { //叶子节点的配置
						collapsed: null, // 如果为 true，表示此节点默认折叠。
						label: {
						  position: 'right',
						  verticalAlign: 'middle',
						  align: 'left'
						}
					  },
					  emphasis: { //树图中个图形和标签高亮的样式。可以是以下参数：none,self,series,ancestor,descendant
						focus: 'descendant'
					  },
					  animation: false,
					  animationDuration: 550, // 动画时长
					  animationDurationUpdate: 750
					}
					]
				});
				orderChart.setOption({
					
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
