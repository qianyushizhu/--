<template>
	<view>
		<u-sticky><u-tabs :list="tabs" active-color="#007AFC" :is-scroll="false" :current="current" @change="change"></u-tabs></u-sticky>

		<view class="showDetail">
			<!-- 公司详情 -->
			<view class="showDetail_box1" v-if="current == 0">
				<view class="container">
					<view class="showDetail_box1_item1">
						<image :src="detail.icon" mode=""></image>
						<view>{{ detail.legalPerson }}</view>
					</view>
					<view class="showDetail_box1_item2">
						<view class="title1">单位名称</view>
						<view class="title2">{{ detail.companyName }}</view>
					</view>
				</view>
				<view class="showDetail_box1_item3">
					<view>
						<view class="title1">公司简介</view>
						<view class="title2"><u-parse :html="detail.companyProfile"></u-parse></view>
					</view>
				</view>
				<view class="showDetail_box1_item3">
					<view>
						<view class="title1">联系电话</view>
						<view class="title2">{{ detail.tel }}</view>
					</view>
					<image @click="call(detail.tel)" src="../../../static/show/lj_icon_dianhua@2x.png" mode=""></image>
				</view>
				<view class="showDetail_box1_item3">
					<view>
						<view class="title1">邮箱</view>
						<view class="title2">{{ detail.email }}</view>
					</view>
				</view>
				<view class="showDetail_box1_item3">
					<view>
						<view class="title1">网站</view>
						<view class="title2">{{ detail.websiteAddress }}</view>
					</view>
					<view class="showDetail_box1_item3_btn" @click="copy(detail.websiteAddress)">点击复制</view>
				</view>
				<view class="showDetail_box1_item3">
					<view>
						<view class="title1">公司地址</view>
						<view class="title2">{{ detail.companyAddress }}</view>
					</view>
				</view>

				<view class="showDetail_box1_item3 showDetail_box1_item3_border">
					<view style="width: 100%;">
						<view class="title1">执照信息</view>
						<view class="showDetail_box1_item3_item_container">
							<view class="showDetail_box1_item3_item_item">
								<view class="title3" style="width: 245rpx;">统一社会信用代码</view>
								<view class="title3" style="width: 70%;text-align: end;">{{ detail.unifiedSocialCreditCode }}</view>
							</view>
							<view class="showDetail_box1_item3_item_item">
								<view class="title3">经营状态</view>
								<view class="title3" style="width: 70%;text-align: end;">{{ detail.companyStatus }}</view>
							</view>
							<view class="showDetail_box1_item3_item_item">
								<view class="title3">公司类型</view>
								<view class="title3" style="width: 70%;text-align: end;">{{ detail.companyStatus }}</view>
							</view>
							<view class="showDetail_box1_item3_item_item">
								<view class="title3" style="width: 150rpx;">法定代表人</view>
								<view class="title3" style="width: 70%;text-align: end;">{{ detail.legalPerson }}</view>
							</view>
							<view class="showDetail_box1_item3_item_item">
								<view class="title3">成立日期</view>
								<view class="title3" style="width: 70%;text-align: end;">{{ detail.companyCreateDate | year_date }}</view>
							</view>
							<view class="showDetail_box1_item3_item_item">
								<view class="title3">注册资本</view>
								<view class="title3" style="width: 70%;text-align: end;">{{ detail.registeredCapital }}</view>
							</view>
							<view class="showDetail_box1_item3_item_item" style="margin-bottom: 30rpx;">
								<view class="title3" >注册地址</view>
								<view class="title3" style="width: 70%;text-align: end;">{{ detail.registeredAddress }}</view>
							</view>
							<view>
								<view class="title3" style="margin-bottom: 30rpx;">经营范围</view>
								<view class="title3" >{{ detail.businessScope }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 公司名片 -->
			<view class="showDetail_box2" v-else-if="current == 1 && list">
				<idcard
					v-for="(detail, index) in list"
					@shareCard="shareCard"
					:key="index"
					@collect="collect(detail.cardId)"
					:address="detail.companyAddress"
					:campnyName="detail.companyName"
					:email="detail.email"
					:job="detail.postInfo"
					:phoneNumber="detail.tel"
					:name="detail.userName"
					:cardId='detail.cardId'
					:image="detail.headLogo"
					:status="detail.collectStatus"
					:companyImage="detail.companyLogoId"
				></idcard>
				<view class="" style="display: flex;justify-content: center;align-items: center;height: 100vh;width: 100%;" v-if="list.length == 0">
		 	<image src="../../../static/show/lj_icon_quesheng@2x.png" style="width: 240rpx;height: 190rpx;" mode=""></image>
		 </view>
			</view>
		</view>
		<u-modal
			v-model="vipShow"
			:mask-close-able="true"
			title="会员提醒"
			width="70%"
			:show-title="true"
			@confirm="confirmVip"
			@cancel="cancelVip"
			content="该内容需要会员才能观看,请登录"
			:show-cancel-button="true"
		></u-modal>
	</view>
</template>
<script>
import { getCompanyDetail, getCompanyCardList, collectCard } from '../../../common/request.js';
import idcard from '../../../component/idcard.vue';
export default {
	components: {
		idcard
	},
	data() {
		return {
			vipShow: false,
			
				isshow: true,
			share:null,
			tabs: [
				{
					name: '公司详情',
					id: 0
				},
				{
					name: '公司名片',
					id: 1
				}
			],
			detail: {},
			id: '',
			list: [],
			currentPage: 1,
			current: 0
		};
	},
	onLoad(opitons) {
		if (!uni.getStorageSync('token')) {
			uni.showModal({
				title: '授权登录',
				showCancel: false,
				confirmColor: '#000',
				content: '您尚未授权登录,请先授权登录',
				success: res => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/index/login/login'
						});
					}
				}
			});
			return;
		}

		this.id = opitons.id;
		if (opitons.type == 'share') {
			this.current = 1;
		}

		this.getCompanyDetail(this.id);
	},
	onShow() {
		this.getCompanyDetail(this.id);
	},
onShareAppMessage(res) {
					  console.log(this.share.path)
		       return {
		           title:this.share.title,
		           path:this.share.path,
		           imageUrl:this.share.imageUrl,
		           desc:this.share.desc,
		           content:this.share.content,
		           success(res){
						  console.log(res)
		               uni.showToast({
		                   title:'分享成功'
		               })
						  console.log(this.share.path)
		           },
		           fail(res){
		               uni.showToast({
		                   title:'分享失败',
		                   icon:'none'
		               })
		           }
		       }
		   },
	methods: {
		confirmVip() {
			uni.navigateTo({
				url: '../../index/vipLogin/vipLogin'
			});
		},
		cancelVip() {
			uni.navigateBack({
				delta: 1
			});
		},
		call(phone) {
			wx.makePhoneCall({
				phoneNumber: phone
			});
		},
		copy(website) {
			this.$Dialog.copyText(website);
		},
		shareCard(share) {
			console.log(share)
			this.share = share
		},

		change(index) {
			this.current = index;
			if (index == 0) {
				this.getCompanyDetail(this.id);
			} else {
				this.getCompanyCardList(this.id);
			}
		},
		collect(cardId) {
			var vm = this;
			let token = uni.getStorageSync('token');
			if (!token) {
				uni.showModal({
					title: '授权登录',
					showCancel: false,
					confirmColor: '#000',
					content: '您尚未授权登录,请先授权登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/index/login/login'
							});
						}
					}
				});
				return;
			}
			uni.showLoading({
				mask: true,
				title: '请求中'
			});
			collectCard({ cardId: cardId }).then(res => {
				if (!res.data.collectStatus) {
					uni.showToast({
						title: '已取消收藏'
					});
				} else {
					uni.showToast({
						title: '收藏成功'
					});
				}

				this.getCompanyCardList(this.id);
			});
		},
		getCompanyCardList(id) {
			getCompanyCardList({
				companyId: id,
				page: this.currentPage
			}).then(res => {
				if (res.code == 1) {
					this.vipShow = true;
				}
				if (res.code == 0) {
					res.data.forEach(item => {
						item.headLogo = this.$imgUrl + item.headLogo;
						item.companyLogoId = this.$imgUrl + item.companyLogoId;
					});

					this.list = res.data;
				}
				if (res.code == 4) {
					this.isshow == false;
				}
			});
		},
		getCompanyDetail(id) {
			getCompanyDetail({
				companyId: id
			}).then(res => {
				res.data.icon = this.$imgUrl + res.data.companyLogoId;
				res.data.business = res.data.business;
				this.detail = res.data;
			});
		}
	}
};
</script>
<style lang="less" scoped>
.showDetail_box1_item3_item_container {
	width: 100%;
	display: flex;
	flex-direction: column;
}
.showDetail_box1_item3_item_item {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 0;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.15);
}
.showDetail {
	padding: 20rpx;
	min-height: 100vh;
	background: #f5f5f5;
}

.title1 {
	font-size: 36rpx;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
}

.title2 {
	margin-top: 30rpx;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
	line-height: 40rpx;
}

.title3 {
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
	line-height: 40rpx;
}

.showDetail_box1_item3_btn {
	width: 156rpx;
	height: 48rpx;
	border-radius: 8rpx;
	border: 2rpx solid #00b386;
	font-size: 24rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #00b386;
	line-height: 46rpx;
	text-align: center;
}
.container {
	background-color: #fff;
	padding: 30rpx 20rpx;
	margin-bottom: 12rpx;
	border-top-right-radius: 16rpx;
	border-top-left-radius: 16rpx;
}
.showDetail_box1 {
	.showDetail_box1_item1 {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.85);
		line-height: 44rpx;
		margin-bottom: 20rpx;

		image {
			width: 152rpx;
			height: 152rpx;
			margin-right: 24rpx;
		}
	}

	.showDetail_box1_item2 {
	}
	.showDetail_box1_item3_border {
		border-bottom-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
	}

	.showDetail_box1_item3 {
		background-color: #fff;
		padding: 30rpx 20rpx;
		margin-bottom: 12rpx;
		display: flex;
		justify-content: space-between;

		image {
			width: 72rpx;
			height: 72rpx;
			margin-right: 22rpx;
		}
	}
}
.showDetail_box2 {
}
</style>
