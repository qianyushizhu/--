<template>
	<view class="mine_bottom">
		<view class="mine_bottom_item">
			<view class="">姓名</view>
			<input placeholder="请输入姓名" :disabled="isOrder" v-model="username" />
		</view>
		
		<view class="mine_bottom_item" >
			<view class="">联系方式</view>
			<input placeholder="请输入联系方式" :disabled="isOrder"v-model="phone" />
		</view>
		
		<view class="mine_bottom_item" >
			<view class="">所属行业</view>
			<input placeholder="请输入所属行业" v-model="job" :disabled="isOrder"/>
		</view>
		
		<view class="" style="border-bottom: 1px solid #d9d9d9;padding: 20px 0;">
		<u-input v-model="remrk" :type="type"  :disabled="isOrder" :height="height" :auto-height="autoHeight" />
		</view>
		
		<view class=""
		v-if="!isOrder"
		@click="signUp"
		 style="width: 345px;
		position: fixed;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		height: 45px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
		background: #49C265;
		border-radius: 8px;">
			立即报名
		</view>
		
	</view>
</template>

<script>
	import {
		signUp,
		getSignInfo
	} from '../../../common/request.js'
	export default {
		data() {
			return {
					username:'',
					phone:'',
					job:'',
					remrk:'',
					activityId:'',
					isOrder:null,
					
								type: 'textarea',
								border: true,
								height: 100,
								autoHeight: true,
			};
		},
		onLoad(op) {
			console.log(op)
					this.activityId  = op.activityId
					this.isOrder = JSON.parse(op.isOrder)
					
					console.log(typeof this.isOrder)
					console.log(this.isOrder)
					if(op.isOrder){
						this.getSignInfo()
					}
		},
		methods:{
			getSignInfo(){
				getSignInfo({
					activityId:this.activityId
				}).then(res=>{
					this.username = res.data.userName
					this.phone = res.data.tel
					this.job = res.data.tradeMsg
					this.remrk = res.data.remark
				})
			},
			signUp(){
				if(this.username =='' &&
				this.phone =='' &&
				this.job =='' 
				){
					uni.showToast({
						title:'请填写完整',
						icon:'error'
					})
					return false
				}
				signUp({
					activityId:this.activityId,
					userName:this.username,
					tradeMsg:this.job,
					remark:this.remrk,
					tel:this.phone,
				}).then(res=>{
					res.code == 0
					 ? (()=>{
						
						uni.navigateBack({
							delta:1,
							success: () => {
								uni.showToast({
									title:'报名成功'
								})
							}
						})
					 })()
					 :  	uni.showToast({
							title:res.msg,
							icon:'error'
						})
				})
			}
		}
	}
</script>

<style lang="less">
/deep/ input {
	text-align: right !important;
}

.mine_bottom {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	font-size: 15px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #262626;
	line-height: 21px;
	letter-spacing: 3rpx;
	padding: 0 15px;
}

.mine_bottom_item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #d9d9d9;
	padding: 20px 0;
}
</style>
