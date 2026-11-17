<template>
    <div class="dashboard-container">
        <div class="dashboard-heading">
            <div>
                <p class="dashboard-eyebrow">WORKSPACE / 工作台</p>
                <h1>管理概览</h1>
                <p class="dashboard-subtitle">快捷入口、趋势分析与系统动态集中查看。</p>
            </div>
            <el-tag type="info" effect="plain" round>演示数据 · 非实时统计</el-tag>
        </div>
        <!-- 顶部信息卡片 -->
        <el-row :gutter="15">
            <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="info-card">
                    <div class="card-content">
                        <div class="card-icon bg-primary">
                            <el-icon><User /></el-icon>
                        </div>
                        <div class="card-text">
                            <div class="card-title">用户总数</div>
                            <div class="card-value">12,345</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="info-card">
                    <div class="card-content">
                        <div class="card-icon bg-success">
                            <el-icon><ShoppingCart /></el-icon>
                        </div>
                        <div class="card-text">
                            <div class="card-title">订单总数</div>
                            <div class="card-value">2,543</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="info-card">
                    <div class="card-content">
                        <div class="card-icon bg-warning">
                            <el-icon><PriceTag /></el-icon>
                        </div>
                        <div class="card-text">
                            <div class="card-title">商品总数</div>
                            <div class="card-value">876</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="info-card">
                    <div class="card-content">
                        <div class="card-icon bg-danger">
                            <el-icon><Money /></el-icon>
                        </div>
                        <div class="card-text">
                            <div class="card-title">总收入</div>
                            <div class="card-value">¥345,678</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 图表区域 -->
        <el-row :gutter="15">
            <el-col :xs="24" :sm="24" :md="16">
                <el-card shadow="hover" class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>访问量统计</span>
                            <el-radio-group v-model="chartType" size="small">
                                <el-radio-button label="本周" value="week"></el-radio-button>
                                <el-radio-button label="本月" value="month"></el-radio-button>
                                <el-radio-button label="本年" value="year"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </template>
                    <div id="visit-chart" style="height: 300px;"></div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8">
                <el-card shadow="hover" class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>销售占比</span>
                        </div>
                    </template>
                    <div id="sale-chart" style="height: 300px;"></div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 快捷操作和消息 -->
        <el-row :gutter="15">
            <el-col :xs="24" :sm="12">
                <el-card shadow="hover" class="quick-actions">
                    <template #header>
                        <div class="card-header">
                            <span>快捷操作</span>
                        </div>
                    </template>
                    <el-row :gutter="10">
                        <el-col :xs="8" :sm="6" v-for="(action,index) in quickActions" :key="action.icon">
                            <el-button class="quick-action-btn" :icon="action.icon" @click="handleQuickAction(action)" v-if="index<12">
                            {{ action.name }}
                            </el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>最新消息</span>
                        </div>
                    </template>
                    <el-scrollbar height="300px">
                        <div v-for="(message, index) in messages" :key="index" class="message-item">
                            <div class="message-title">{{ message.title }}</div>
                            <div class="message-time">{{ message.time }}</div>
                            <div class="message-content">{{ message.content }}</div>
                        </div>
                    </el-scrollbar>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
    import * as echarts from 'echarts'
    import {useUserState} from "@/store/userState";
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const userState = useUserState()

    // 图表类型
    const chartType = ref('week')

    let quickActions = computed(() => {
        let tmparr = []
        ;(userState.permissions?.menus || []).forEach(item=>{
            if(item.type == 1){
                tmparr.push({
                    name:item.name,
                    icon:item.icon,
                    action:item.web_path
                })
            }
        })
        return tmparr
    })

    // 消息列表
    const messages = ref([
        { title: '系统公告', time: '2025-11-13 11:10', content: '系统新增了数据导出功能，欢迎使用。' },
    ])

    // 处理快捷操作
    const handleQuickAction = (action) => {
        router.push({path:action.action})
    }

    // 初始化图表
    let visitChart = null
    let saleChart = null

    const initCharts = () => {
        const visitElement = document.getElementById('visit-chart')
        const saleElement = document.getElementById('sale-chart')
        if (!visitElement || !saleElement) return
        // 访问量图表
        visitChart = echarts.init(visitElement)
        visitChart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['访问量', '注册量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '访问量',
                    type: 'line',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '注册量',
                    type: 'line',
                    data: [20, 32, 21, 34, 20, 50, 40]
                }
            ]
        })

        // 销售占比图表
        saleChart = echarts.init(saleElement)
        saleChart.setOption({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
            {
                name: '销售占比',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: '电子产品' },
                    { value: 735, name: '服装' },
                    { value: 580, name: '食品' },
                    { value: 484, name: '家居' },
                    { value: 300, name: '其他' }
                ]
            }
            ]
        })

    }

    const resizeCharts = () => {
        visitChart?.resize()
        saleChart?.resize()
    }

    onMounted(async () => {
        await nextTick()
        initCharts()
        window.addEventListener('resize', resizeCharts)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeCharts)
        visitChart?.dispose()
        saleChart?.dispose()
        visitChart = null
        saleChart = null
    })
    
</script>

<style scoped>
    .dashboard-container {
        padding: var(--lee-space-page, 20px);
        min-height: 100%;
    }
    .dashboard-heading {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;
    }
    .dashboard-heading h1 {
        color: var(--el-text-color-primary);
        font-weight: 650;
        font-size: 26px;
        letter-spacing: -.5px;
        line-height: 1.35;
        margin: 3px 0 6px;
    }
    .dashboard-eyebrow {
        color: var(--el-color-primary);
        font-size: 11px;
        letter-spacing: 1.2px;
        font-weight: 700;
    }
    .dashboard-subtitle {
        color: var(--el-text-color-secondary);
        font-size: 13px;
        line-height: 1.6;
    }

    /* 信息卡片样式 */
    .info-card {
        border-radius: var(--lee-radius-md, 12px);
    }

    .info-card :deep(.el-card__body) {
        padding: 20px;
    }

    .card-content {
        display: flex;
        align-items: center;
    }

    .card-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: white;
        font-size: 21px;
    }

    .bg-primary {
        background-color: #409EFF;
    }

    .bg-success {
        background-color: #67C23A;
    }

    .bg-warning {
        background-color: #E6A23C;
    }

    .bg-danger {
        background-color: #F56C6C;
    }

    .card-text {
        flex: 1;
    }

    .card-title {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-bottom: 5px;
    }

    .card-value {
        font-size: 26px;
        font-weight: 650;
        letter-spacing: -.3px;
        color: var(--el-text-color-primary);
    }

    /* 图表卡片样式 */
    .chart-card {
        border-radius: var(--lee-radius-md, 12px);
    }

    .chart-card :deep(.el-card__body) {
        padding: 0;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* 快捷操作按钮 */
    .quick-action-btn {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80px;
        white-space: normal;
        word-break: break-all;
        padding: 5px;
    }

    .quick-action-btn :deep(.el-icon) {
        font-size: 20px;
        margin-bottom: 5px;
    }

    /* 消息列表样式 */
    .message-item {
        padding: 10px 0;
        border-bottom: 1px solid var(--el-border-color-light);
    }

    .message-item:last-child {
        border-bottom: none;
    }

    .message-title {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .message-time {
        font-size: 12px;
        color: #909399;
        margin-bottom: 5px;
    }

    .message-content {
        font-size: 13px;
        color: var(--el-text-color-regular);
        line-height: 1.5;
    }

    /* 响应式调整 */
    @media screen and (max-width: 768px) {
        .card-icon {
            width: 40px;
            height: 40px;
            font-size: 16px;
        }

        .card-value {
            font-size: 18px;
        }

        .quick-action-btn {
            height: 70px;
            font-size: 12px;
        }

        .quick-action-btn :deep(.el-icon) {
            font-size: 16px;
        }
    }
</style>