import Vue from 'vue';
import ECharts from 'vue-echarts/components/ECharts.vue';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/tree';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/geo';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';

Vue.component('chart', ECharts);
// Vue.component('chart', ECharts);
// Vue.use(ECharts);
