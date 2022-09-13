<template>
	<view class="account_container">
		<u-notice-bar mode="horizontal" :list="tip"></u-notice-bar>

		<view class="account_item" v-if="role == 3">
			<view class="account_left">
				<view class="account_left_item">
					<view>姓名：</view>
					<text>{{ detail.userName }}</text>
				</view>
				<view class="account_left_item">
					<view>账号：</view>
					<text>{{ detail.account }}</text>
				</view>
				<view class="account_left_item">
					<view>状态：</view>
					<text>{{ detail.activateStatus ? '已激活' : '未激活' }}</text>
				</view>
			</view>
		</view>
		<template v-else>
			<view class="account_item" style="margin-bottom: 20rpx;" v-for="item in list" :key="item.account">
				<view class="account_left">
					<view class="account_left_item">
						<view>姓名：</view>
						<text>{{ item.userName }}</text>
					</view>
					<view class="account_left_item">
						<view>账号：</view>
						<text>{{ item.account }}</text>
					</view>
					<view class="account_left_item">
						<view>状态：</view>
						<text>{{ item.activateStatus ? '已激活' : '未激活' }}</text>
					</view>
				</view>
				<view class="account_right">
					<view class="account_right_top">
						<view @click.stop="openUpdate(item)" class="account_right_top_item" >
							<image v-if="item.activateStatus" src="../../../static/new/gx_icon_bianji@2x.png" style="width: 24rpx;height: 24rpx;display: block;" mode=""></image>
							<image v-else src="../../../static/new/gx_icon_bianji2@2x.png" style="width: 30rpx;height: 30rpx;display: block;" mode=""></image>
							<view :class="[item.activateStatus ? 'account_right_top_text_active' : '']">编辑</view>
						</view>
						<view
							@click.stop="openReset(item)"
							class="account_right_top_item account_right_top_item_unActive"
							:class="[item.activateStatus ? 'account_right_top_item_active' : '']"
						>
							<image
								v-if="item.activateStatus"
								src="../../../static/new/gx_icon_chushihua2@2x.png"
								style="width: 30rpx;height: 28rpx;display: block;"
								mode=""
							></image>
							<image v-else src="../../../static/new/gx_icon_chushihua@2x.png" style="width: 30rpx;height: 30rpx;display: block;" mode=""></image>
							<view>初始化</view>
						</view>
					</view>
					<view class="account_right_buttom" @click.stop="opendel(item)">
						<image src="../../../static/new/gx_icon_shanchu@2x.png" style="width: 24rpx;height: 27rpx;display: block;" mode=""></image>
						<view style="color: #FF1400;">删除</view>
					</view>
				</view>
			</view>
		</template>
		<u-button type="warning"  @click="openAdd" style='position: fixed;bottom:250rpx;width: 80%;left: 50%;transform: translateX(-50%);'>添加账号</u-button>
		<!-- 添加 -->
		<u-modal
			v-model="add"
			:mask-close-able="true"
			:title="addOredit ? '添加账号' : '修改账号'"
			width="80%"
			:show-title="true"
			@confirm="addconfirmVip"
			@cancel="addcancelVip"
			:show-cancel-button="true"
		>
			<view class="" style="padding: 40rpx;box-sizing: border-box;">
				<view class="" style="display: flex;align-items: center;margin-bottom: 20rpx;">
					<view class="" style="width: 184rpx;">姓名：</view>
					<input type="text" v-model="nickName" value="" placeholder="请输入姓名" />
				</view>
				<view class="" style="display: flex;align-items: center;margin-bottom: 20rpx;">
					<view class="" style="width: 184rpx;">手机号：</view>
					<input type="text" v-model="account" value="" placeholder="请输入账号" />
				</view>
				<view class="" v-if="!addOredit" style="display: flex;align-items: center;margin-bottom: 20rpx;">
					<view class="" style="width: 184rpx;">密码：</view>
					<input type="text" v-model="passWord" value="" placeholder="请输入密码" />
				</view>
			</view>
		</u-modal>

		<!-- 初始化 -->
		<u-modal
			v-model="reset"
			:mask-close-able="true"
			title="温馨提示"
			width="70%"
			:show-title="true"
			@confirm="resetconfirmVip"
			@cancel="resetcancelVip"
			content="初始化数据后，该账号绑定的微信信息将会清除，请确认是否操作"
			:show-cancel-button="true"
		></u-modal>
		<!-- 初始化 -->
		<u-modal
			v-model="accoutdelete"
			:mask-close-able="true"
			title="温馨提示"
			width="70%"
			:show-title="true"
			@confirm="delconfirmVip"
			@cancel="delcancelVip"
			content="请确认是否删除"
			:show-cancel-button="true"
		></u-modal>
	</view>
</template>

<script>
import { getUserAccount, getCompanyAccounts, resetAccount, delAccount, modifyAccount, addAccount } from '../../../common/request.js';
export default {
	data() {
		return {
			role: 4,
			detail: {},
			list: [],
			reset: false,
			update: false,
			add: false,
			account: '',
			addOredit: true,
			nickName: '',
			passWord: '',
			tip: ['子账号密码默认为手机号后六位，通过点击列表可以添加，通过编辑可以修改'],
			accountId: '',
			accoutdelete:false
		};
	},
	onLoad() {
		this.role = uni.getStorageSync('userRole');
		if (this.role == 3) {
			this.getUserAccount();
		} else if (this.role == 2) {
			this.getCompanyAccounts();
		}
	},
	methods: {
		getUserAccount() {
			uni.login({
				success: res => {
					getUserAccount({
						code: res.code
					}).then(res => {
						this.detail = res.data;
					});
				}
			});
		},
		getCompanyAccounts() {
			uni.login({
				success: res => {
					getCompanyAccounts({
						code: res.code
					}).then(res => {
						// let length = 4 - res.data.length;
						// for (let i = 0; i < length; i++) {
						// 	res.data.push({
						// 		activateStatus: false,
						// 		needActive: 1,
						// 		account: '',
						// 		userName: ''
						// 	});
						// }
						this.list = res.data ? res.data : []
						console.log(this.list);
					});
				}
			});
		},
		openAdd() {
			if(this.list.length == 4){
				uni.showToast({
					title:'账号数量已上限',
					icon:'error'
				})
				return
			}
			this.addOredit = true;
				this.account=''
				this.nickName=''
				this.add = true;
			this.getCompanyAccounts()
		},
		openUpdate(item) {
			if(item.userName==''){
				uni.showToast({
					icon:'none',
					title:'请先添加账号'
				})
				return
			}
			this.addOredit = false;
			this.accountId = item.accountId;
			this.nickName = item.userName
			this.account = item.account
			this.add = true;
		},
		addconfirmVip() {
			if (this.nickName !== '' && this.account !== '') {
				if (this.addOredit) {
					addAccount({
						userName: this.nickName,
						account: this.account
						
					}).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '添加成功',
								icon: 'success'
							});
							this.add = false;
							this.getCompanyAccounts();
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
				} else {
					resetAccount({
						userName: this.nickName,
						account: this.account,
						password: this.password,
						accountId: this.accountId
					}).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '修改成功',
								icon: 'success'
							});
							this.add = false;
							this.getCompanyAccounts();
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
				}
			}
		},
		addcancelVip() {
			this.add = false;
		},
		
		
		openReset(item) {
			if(item.userName==''){
				uni.showToast({
					icon:'none',
					title:'请先添加账号'
				})
				return
			}
			if(item.accountId){
				this.accountId = item.accountId;
				this.reset = true;
			}else{
				uni.showToast({
					title: '请先激活账号',
					icon: 'none'
				});
			}
			
		},
		resetconfirmVip() {
			resetAccount({
				accountId:this.accountId
			}).then(res=>{
				if (res.code == 0) {
					uni.showToast({
						title: '重置成功',
						icon: 'success'
					});
					this.reset = false;
					this.getCompanyAccounts();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			})
		},
		resetcancelVip() {
			this.reset = false;
		},
		opendel(item){
			if(item.userName==''){
				uni.showToast({
					icon:'none',
					title:'请先添加账号'
				})
				return
			}
			this.accountId = item.accountId
			this.accoutdelete = true
		},
		delconfirmVip(){
			delAccount({
				accountId:this.accountId
			}).then(res=>{
				if (res.code == 0) {
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
					this.accoutdelete = false;
					this.getCompanyAccounts();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			})
		},
		delcancelVip() {
			this.accoutdelete = false;
		},
	}
};
</script>

<style lang="less">
.account_container {
	box-sizing: border-box;
	background-color: #f6f6f6;
	padding: 20rpx 30rpx;
	align-items: center;
	min-height: 100vh;
	input {
		width: 100%;
		border-radius: 8rpx;
		height: 70rpx;
		border: 1rpx solid #a6a6a6;
		padding-left: 20rpx;
	}
}
.account_item {
	display: flex;
	width: 100%;
	height: 208rpx;
	background: #ffffff;
	border-radius: 16rpx;
	font-size: 30rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.85);
	.account_left {
		padding: 30rpx;
		width: 70%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.account_left_item {
			display: flex;
			margin-bottom: 12rpx;
			view {
				margin-right: 28rpx;
			}
		}
	}
	.account_right {
		box-sizing: border-box;
		width: 30%;
		height: 100%;
		display: flex;
		flex-direction: column;
		border-left: 1rpx solid #F7F7F7;
		.account_right_top {
			height: 50%;
			width: 100%;
			display: flex; 
			border-bottom: 1rpx solid #F7F7F7;
			.account_right_top_item {
				width: 50%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 20rpx;
				font-family: PingFang-SC-Regular, PingFang-SC;
				font-weight: 400;
				border-radius: 0px 16rpx 0px 0px;
				color: #a6a6a6;
				
				image {
					margin-bottom: 8rpx;
				}
			}
			.account_right_top_item_unActive {
				background: #fbfbfb;
			}
			.account_right_top_item_active {
				background: #ecf2ff;
				color: #007AFC;
			}
			.account_right_top_text_active {
				color: #007AFC;
			}
		}
		.account_right_buttom {
			height: 50%;
			width: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			font-size: 20rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			image {
				margin-bottom: 8rpx;
			}
		}
	}
}
</style>
