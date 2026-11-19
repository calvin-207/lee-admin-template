<template>
	<el-form ref="loginFormRef" :model="formData" :rules="rules" label-width="0" size="large" @keyup.enter="submitLogin" :disabled="islogining">
		<el-form-item prop="username">
			<el-input v-model="formData.username" name="username" autocomplete="username" prefix-icon="user" clearable placeholder="请输入用户名">
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="formData.password" type="password" name="password" :autocomplete="rememberCredentials ? 'current-password' : 'off'" prefix-icon="lock" clearable show-password placeholder="请输入密码"></el-input>
		</el-form-item>
		<el-form-item prop="captcha" v-if="userState.sysConfig.loginCaptcha">
            <el-input type="text" prefix-icon="circle-check" v-model.trim="formData.captcha" auto-complete="off" placeholder="验证码" :rules="userState.sysConfig.loginCaptcha?captchaRules:[]">
                  <template #append>
                    <lee-img class="login-captcha" :src="image_base" @click="getCaptchas" />
                  </template>
            </el-input>
          </el-form-item>
		<el-form-item class="remember-row">
			<el-checkbox v-model="rememberCredentials">记住账号、密码</el-checkbox>
			<span class="remember-hint">密码由浏览器安全保存</span>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" class="login-btn" style="width: 100%;" :loading="islogining" round @click="submitLogin">登录</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
	import {ref, onMounted,watch,computed ,nextTick} from 'vue'
	import {autoStorage,setToken,setRefreshToken} from '@/utils/util'
	import { ElMessage } from 'element-plus'
	import { useRouter,useRoute } from 'vue-router'
	import Api from "@/api/api"
	import sysConfig from "@/config"
	import {useUserState} from "@/store/userState";
	import { useTabsStore } from '@/store/tabs'

	const userState = useUserState()

	// let API_BASE_URL = sysConfig.API_URL

	// // 当前是生产环境
	// if (import.meta.env.PROD) {
	// 	// 获取浏览器地址
	// 	API_BASE_URL = window.location.origin;
	// }
	const API_BASE_URL = window.location.origin

	const router = useRouter()

	let formData = ref({
		username: "",
		password: "",
		captcha: "",
		captchaKey: null,
	})
	// 只在本地保存用户名及用户的选择，不保存明文密码或可逆加密密码。
	const REMEMBER_LOGIN_KEY = 'lee-admin:remember-login'
	const REMEMBER_USERNAME_KEY = 'lee-admin:remember-username'
	const rememberCredentials = ref(false)

	function loadRememberedLogin() {
		try {
			rememberCredentials.value = localStorage.getItem(REMEMBER_LOGIN_KEY) === 'true'
			if (rememberCredentials.value) {
				formData.value.username = localStorage.getItem(REMEMBER_USERNAME_KEY) || ''
			}
		} catch (_) {
			// 禁止本地存储的浏览器中仍可正常登录。
		}
	}

	function persistRememberedLogin() {
		try {
			if (rememberCredentials.value) {
				localStorage.setItem(REMEMBER_LOGIN_KEY, 'true')
				localStorage.setItem(REMEMBER_USERNAME_KEY, formData.value.username)
			} else {
				localStorage.removeItem(REMEMBER_LOGIN_KEY)
				localStorage.removeItem(REMEMBER_USERNAME_KEY)
			}
		} catch (_) {
			// 存储失败不影响登录。
		}
	}

	function requestBrowserPasswordSave() {
		if (!rememberCredentials.value || !window.isSecureContext ||
			!('PasswordCredential' in window) || !navigator.credentials?.store) return
		try {
			const credential = new window.PasswordCredential({
				id: formData.value.username,
				password: formData.value.password,
				name: formData.value.username,
			})
			// 浏览器可能拒绝保存或不支持此 API；不阻断登录。
			Promise.resolve(navigator.credentials.store(credential)).catch(() => {})
		} catch (_) {
			// 其他浏览器依靠 autocomplete 提示其内置密码管理器。
		}
	}

	let image_base = ref(null)
	let captchaRules = [
		{required: true, message: "请输入验证码", trigger: 'blur'}
	]
	let rules = ref({
		username: [
			{required: true, message: "请输入账号", trigger: 'blur'}
		],
		password: [
			{required: true, message: "请输入密码", trigger: 'blur'}
		]
	})
	let islogining = ref(false)

	/**
	* 获取验证码
	*/
	function getCaptchas () {
		Api.getCaptcha().then((res) => {
			if(res.code == 2000){
				formData.value.captcha = null
				formData.value.captchaKey = res.data.key
				image_base.value = res.data.image_base
        console.log('====', formData)
			}else{
				ElMessage.error(res.msg)
			}
		})
	}

	let loginFormRef = ref(null)

	const submitLogin = async () => {
		if (islogining.value) return; // 防止重复提交

		try {
			islogining.value = true; // 开启加载状态

			// 1. 表单验证
			await loginFormRef.value.validate();

			// 2. 调用登录接口（重点修改部分）
			const res = await Api.getToken(formData.value);
    
			if (res.code === 2000) {
				islogining.value = true
				// 3. 登录成功处理
				setToken('logintoken', res.data.access);
				setRefreshToken('refreshtoken', res.data.refresh);
				persistRememberedLogin();
				requestBrowserPasswordSave();
				await userState.getSystemWebRouter(router)
				loginSuccess(); // 执行跳转等操作
				ElMessage.success('登录成功');

				islogining.value = false
			} else {
				// 4. 登录失败（服务端返回错误）
				ElMessage.error(res.msg || '登录失败');
				getCaptchas(); // 刷新验证码
			}

		} catch (error) {
			// 区分验证失败和请求失败
			if (error.fields) {
				ElMessage.warning('请填写正确的登录信息');
			} else {
				ElMessage.error('登录失败，请重试');
			}
		} finally {
			islogining.value = false; // 关闭加载状态
		}
	}

	function getCacheActiveTab(){
		let tabsStore = useTabsStore()
		return tabsStore.activeTab
	}

	function loginSuccess(){
		let firstpath = getCacheActiveTab()
		if(!firstpath){
			window.location.href = API_BASE_URL+"/#/"
		}else{
			router.push(firstpath);
		}
		
	}

	onMounted(()=>{
		loadRememberedLogin()
		//请求数据
		getCaptchas()
	})

</script>

<style scoped>
	.login-captcha{
		cursor: pointer;
		height: 38px;
		width: 128px;
		display: block;
		margin: 0px -19px;
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
	}
	.remember-row :deep(.el-form-item__content) {
		display: flex;
		justify-content: space-between;
		gap: 8px;
	}
	.remember-hint {
		color: var(--el-text-color-secondary);
		font-size: 12px;
	}
	.login-btn{
		margin-top: 10px;
	}
</style>