<template>
    <div class="diy-list-container">
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span>小程序装修</span>
                    <el-button type="primary" :icon="Plus" @click="handleAdd">新建页面</el-button>
                </div>
            </template>

            <!-- 搜索 -->
            <el-form :inline="true" :model="queryParams" class="search-form">
                <el-form-item label="页面标题">
                    <el-input v-model="queryParams.title" placeholder="请输入页面标题" clearable @keyup.enter="loadList" />
                </el-form-item>
                <el-form-item label="页面类型">
                    <el-select v-model="queryParams.type" placeholder="全部" clearable style="width:150px">
                        <el-option label="首页" value="DIY_INDEX" />
                        <el-option label="个人中心" value="DIY_MEMBER_INDEX" />
                        <el-option label="自定义微页面" value="DIY_PAGE" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="loadList">查询</el-button>
                    <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 列表 -->
            <el-table :data="tableData" v-loading="loading" border stripe>
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="title" label="页面标题" min-width="140" show-overflow-tooltip />
                <el-table-column prop="name" label="页面标识" width="160" />
                <el-table-column prop="type" label="类型" width="120">
                    <template #default="{ row }">
                        <el-tag :type="typeTag(row.type)">{{ typeText(row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_default" label="状态" width="90">
                    <template #default="{ row }">
                        <el-tag v-if="row.is_default" type="success">启用中</el-tag>
                        <el-tag v-else type="info">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="visit_count" label="访问量" width="90" />
                <el-table-column prop="update_datetime" label="更新时间" width="170" />
                <el-table-column label="操作" width="280" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="handleDecorate(row)">装修</el-button>
                        <el-button link type="success" v-if="!row.is_default" @click="handleSetUse(row)">启用</el-button>
                        <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-wrap">
                <el-pagination
                    v-model:current-page="queryParams.page"
                    v-model:page-size="queryParams.limit"
                    :total="total"
                    :page-sizes="[10, 20, 50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="loadList"
                    @current-change="loadList"
                />
            </div>
        </el-card>

        <!-- 新建/编辑弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
            <el-form :model="form" label-width="100px">
                <el-form-item label="页面标题">
                    <el-input v-model="form.title" placeholder="请输入页面标题" />
                </el-form-item>
                <el-form-item label="页面标识">
                    <el-input v-model="form.name" placeholder="如 DIY_INDEX" />
                </el-form-item>
                <el-form-item label="页面类型">
                    <el-select v-model="form.type" style="width:100%">
                        <el-option label="首页" value="DIY_INDEX" />
                        <el-option label="个人中心" value="DIY_MEMBER_INDEX" />
                        <el-option label="自定义微页面" value="DIY_PAGE" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Api from '@/api/api'

const router = useRouter()

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const queryParams = reactive({ title: '', type: '', page: 1, limit: 10 })

const dialogVisible = ref(false)
const dialogTitle = ref('新建页面')
const form = reactive({ id: null, title: '', name: '', type: 'DIY_PAGE' })

const typeText = (t) => ({ DIY_INDEX: '首页', DIY_MEMBER_INDEX: '个人中心', DIY_PAGE: '微页面' }[t] || '微页面')
const typeTag = (t) => ({ DIY_INDEX: 'danger', DIY_MEMBER_INDEX: 'warning', DIY_PAGE: 'info' }[t] || 'info')

const loadList = () => {
    loading.value = true
    Api.leediyPageList(queryParams).then(res => {
        tableData.value = res.data.data || []
        total.value = res.data.total || 0
    }).finally(() => { loading.value = false })
}

const resetQuery = () => {
    queryParams.title = ''
    queryParams.type = ''
    queryParams.page = 1
    loadList()
}

const handleAdd = () => {
    Object.assign(form, { id: null, title: '', name: '', type: 'DIY_PAGE' })
    dialogTitle.value = '新建页面'
    dialogVisible.value = true
}

const handleEdit = (row) => {
    Object.assign(form, { id: row.id, title: row.title, name: row.name, type: row.type })
    dialogTitle.value = '编辑页面'
    dialogVisible.value = true
}

const submitForm = () => {
    if (!form.title) return ElMessage.warning('请输入页面标题')
    const action = form.id ? Api.leediyPageEdit(form) : Api.leediyPageAdd(form)
    action.then(() => {
        ElMessage.success(form.id ? '编辑成功' : '新建成功')
        dialogVisible.value = false
        loadList()
    })
}

const handleDelete = (row) => {
    ElMessageBox.confirm(`确定删除页面「${row.title}」吗？`, '提示', { type: 'warning' }).then(() => {
        Api.leediyPageDelete({ id: row.id }).then(() => {
            ElMessage.success('删除成功')
            loadList()
        })
    }).catch(() => {})
}

const handleSetUse = (row) => {
    Api.leediyPageSetUse({ id: row.id }).then(() => {
        ElMessage.success('启用成功')
        loadList()
    })
}

const handleDecorate = (row) => {
    router.push({ path: '/leediy/decorate', query: { id: row.id } })
}

onMounted(() => { loadList() })
</script>

<style lang="scss" scoped>
.diy-list-container {
    .card-header { display: flex; justify-content: space-between; align-items: center; }
    .search-form { margin-bottom: 16px; }
    .pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
}
</style>
