
layui.define(function(exports){
    exports('echarts', {
        /**
         * [_bar 拆线图]
         * @param  {[type]} obj   [作用域ID]
         * @param  {[type]} title [标题]
         * @param  {[type]} color [颜色]
         * @param  {[type]} xdata [x轴数据]
         * @param  {[type]} ydata [y轴数据]
         */
        _line: function(obj, title, color, xdata, ydata){
            var series = [];
            for(var i in ydata){
                series.push({
                    name:title[i], type:'line', smooth:true, lineStyle:{normal:{width:2}}, 
                    itemStyle:{normal:{borderWidth:4}},
                    data:ydata[i]
                });
            }
            option = {
                color:color,
                tooltip:{
                    trigger:'axis',
                    axisPointer:{lineStyle:{color:'#666',width:2}}
                },
                legend:{data:title},
                grid:{top:'15%', left:'3%', right:'4%', bottom:'middle', height:'80%', containLabel: true},
                xAxis:{
                    axisTick:{show:false},
                    // axisLine:{lineStyle:{color:"#009688", width:2}},
                    axisLabel:{textStyle:{color:'#333'}},
                    data:xdata
                },
                yAxis:{
                    axisTick:{show:false},
                    axisLine:{show:false},
                    axisLabel:{textStyle:{color:'#333'}},
                    splitLine:{lineStyle:{type:'dotted'}}
                },
                series:series
            };
            echarts.init(document.getElementById(obj)).setOption(option);
        },
        /**
         * [_bar 柱状图]
         * @param  {[type]} obj   [作用域ID]
         * @param  {[type]} title [标题]
         * @param  {[type]} color [颜色]
         * @param  {[type]} xdata [x轴数据]
         * @param  {[type]} ydata [y轴数据]
         */
        _bar: function(obj, title, color, xdata, ydata){
            var series = [];
            for(var i in ydata){
                series.push({
                    name:title[i], type:'bar', stack:'sum', barWidth:'10px', data:ydata[i]
                });
            }
            option = {
                color:color,
                tooltip:{
                    trigger:'axis',
                    axisPointer:{lineStyle:{color:'#666',width:2}}
                },
                legend:{data:title},
                grid:{top:'15%', left:'3%', right:'4%', bottom:'middle', height:'80%', containLabel: true},
                xAxis:[{
                    axisTick:{show:false},
                    // axisLine:{lineStyle:{color:"#009688", width:2}},
                    axisLabel:{textStyle:{color:'#333'}},
                    data: xdata,
                }],
                yAxis:[{
                    axisTick:{show:false},
                    axisLine:{show:false},
                    axisLabel:{textStyle:{color:'#333'}},
                    splitLine:{lineStyle:{type:'dotted'}}
                }],
                series:series
            };
            echarts.init(document.getElementById(obj)).setOption(option);
        },
        /**
         * [_pie 饼图]
         * @param  {[type]} obj       [作用域ID]
         * @param  {[type]} title     [区块标题]
         * @param  {[type]} color     [颜色]
         * @param  {[type]} hoverName [鼠标触发标题]
         * @param  {[type]} data      [数据]
         */
        _pie: function(obj, title, color, hoverName, data){
            option = {
                tooltip:{formatter: "{a} : {b} <br/>"+hoverName[1]+" : {c} ( 占比 : {d}% )"},
                legend:{orient:'vertical', x:'left', data:title},
                series : [{
                    name:hoverName[0],
                    type:'pie',
                    roseType:'radius',
                    radius:'50%',
                    center:['50%','65%'],
                    minAngle: 18,
                    color:color,
                    label:{normal:{formatter:['{c|{c}次}', '{b|{b}}'].join('\n'), rich:{c:{}, b:{}}}},
                    data:data
                }]
            };
            echarts.init(document.getElementById(obj)).setOption(option);
        },
        /**
         * [_radar 雷达图]
         * @param  {[type]} obj   [作用域ID]
         * @param  {[type]} title [区块标题]
         * @param  {[type]} color [颜色]
         * @param  {[type]} type  [名区块属性及最大值]
         * @param  {[type]} data  [数据]
         */
        _radar: function(obj, title, color, type, data){
            var seriesData = [];
            for(var i in data){
                seriesData.push({
                    value:data[i].value,
                    name:data[i].name,
                    lineStyle:{color:color[i]},
                    itemStyle:{color:color[i]},
                    areaStyle:{color:color[i],opacity: 0.6}
                });
            }
            var option = {
                tooltip:{position: ['50%','10%']},
                legend:{
                    x:'center', data:title
                },
                polar:[{
                    indicator:type,
                    radius:70,
                    center:['50%','55%']
                }],
                series:[{
                    type:'radar',
                    data:seriesData
                }]
            };
            echarts.init(document.getElementById(obj)).setOption(option);
        }
    });
});