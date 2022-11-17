<template>
	<view style="padding: 18px 15px;">
		<view class="" style="margin-bottom: 28px;font-size: 21px;font-weight: 600;color: rgba(0,0,0,0.85);">{{ articleListDetail.title }}</view>
		<view class="" style="margin-bottom: 25px;font-size: 12px;font-weight: 400;color: rgba(0,0,0,0.45);">{{ articleListDetail.createTime | year_date }}</view>
		<view class="" v-html="articleListDetail.content"></view>

		<view
			class=""
			v-if="articleListDetail.canSign"
			@click="toOrder"
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
		border-radius: 8px;"
		>
			{{ articleListDetail.signStatus ? '查看报名信息' : '立即报名' }}
		</view>
		<u-mask :show="xxxshow"></u-mask>
	</view>
</template>

<script>
import { getActivity } from '../../../../common/request.js';
export default {
	data() {
		return {
			activityId: '',
			articleListDetail: {},
			xxxshow:true
			
		};
	},
	onLoad(op) {
		if (!uni.getStorageSync('token')) {
		 uni.showModal({
		   title: "授权登录",
		 			showCancel:false,
		 			confirmColor:'#000',
		   content: "您尚未授权登录,请先授权登录",
		   success: (res) => {
		     if (res.confirm) {
		      uni.navigateTo({
		       url:'/pages/login/login'
		      })
		     }
		   }
		 })
		  return
		}
		uni.showLoading({
			title:'加载中'
		})		
		this.activityId = op.activityId;
		this.getActivity();
	},
	onShow() {
		this.getActivity();
	},
	methods: {
		getActivity() {
			getActivity({
				activityId: this.activityId
			}).then(res => {
				this.articleListDetail = res.data;
				this.xxxshow = false
				uni.hideLoading()
			});
		},
		toOrder() {
			uni.navigateTo({
				url: '/pages/index/actitlyOrder/actitlyOrder?activityId=' + this.activityId + '&isOrder=' + this.articleListDetail.signStatus
			});
		}
	}
};
</script>

<style lang="less">
	/deep/ .u-mask{
		background-color: #FFFFFF !important;
	}
</style>
