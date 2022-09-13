<template>
	<view>
		<view class="show_top"><u-tabs :list="tabs" active-color="#007AFC" :is-scroll="true" :bar-style="{
			 				  backgroundColor: '#49C265',
			 }" :current="current" @change="change"></u-tabs></view>

		<view class="show" v-if="tabscampny.length !== 0">
			<view class="show_item" @click="toDetail(item.companyId)" v-for="(item, index) in tabscampny" :key="index">
				<image v-if="item.icon" :src="item.icon" mode=""></image>
				<view v-else class="" style="background: #D8D8D8;width: 152rpx;height: 152rpx;margin-right: 24rpx;">
					
				</view>
				<view class="show_item_right" >
					<view class="text_hidden_1">{{ item.companyName }}</view>
					<view class="text_hidden">主营：{{ item.businessScope ? item.businessScope : '---' }}</view>
				</view>
			</view>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
		<view style="width: 100%;height: 100vh;display: flex;justify-content: center;align-items: center;" v-else>
			<image src="../../static/show/lj_icon_quesheng@2x.png" style="width: 240rpx;height: 190rpx;" mode=""></image>
		</view>
		<u-modal
			v-model="vipShow"
			:mask-close-able="true"
			title="会员提醒"
			width="70%"
			:show-title="true"
			@confirm="confirmVip"
			@cancel="cancelVip"
			:content="content"
			:show-cancel-button="true"
		></u-modal>
	</view>
</template>

<script>
import { getCompanyList, getTypes } from '../../common/request.js';
export default {
	data() {
		return {
			tabs: [],
			current: 0,
			currentPage: 1,
			tabscampny: [],
			status: 'loadmore',
			iconType: 'flower',
			loadText: {
				loadmore: '上拉或点击加载更多',
				loading: '努力加载中',
				nomore: '没有更多数据'
			},
			vipShow:false,
			content:'该内容需要会员才能观看,请登录'
		};
	},
	onLoad() {
		this.getTypes();
		this.init()
		
	},
	onPullDownRefresh() {
		this.tabscampny = []
		this.currentPage = 1
		this.getTypes()
		this.getCompanyList()
		
		 setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);

	},
	onReachBottom() {
		this.currentPage = ++this.currentPage;
		this.status = 'loading';
		this.getCompanyList();
	},
	methods: {
		confirmVip() {
			uni.navigateTo({
				url: '/pages/index/vipLogin/vipLogin'
			});
		},
		cancelVip() {
		
		},
		// 获取所有会员分类
		getTypes() {
			getTypes({
				typeGroup: 'COMPANY'
			}).then(res => {
				let obj = {
					name: '全部'
				};
				res.data.forEach(e => {
					e.name = e.typeName;
				});
				res.data.unshift(obj);
				this.tabs = res.data;
			});
		},
		getCompanyList() {
			if (this.tabs[this.current].typeId) {
				getCompanyList({
					typeId: this.tabs[this.current].typeId,
					page: this.currentPage
				}).then(res => {
					res.data.forEach(item => {
							
						if(item.companyLogoId){
							item.icon = this.$imgUrl + item.companyLogoId;
						}
						item.business = item.businessScope;
					});
					// if(result) this.tabscampny = res.data
					// else this.tabscampny = this.tabscampny.concat(res.data)
					this.tabscampny = this.tabscampny.concat(res.data);

					if (res.data.length == 0 || this.tabscampny.length == res.count || res.count == 0 || this.tabscampny.length == 0|| res.data.length<10) this.status = 'nomore';
					else this.status = 'loadmore';
					console.log(this.status);
				});
			}else{
				getCompanyList({
					page: this.currentPage
				}).then(res => {
					res.data.forEach(item => {
						item.icon = this.$imgUrl + item.companyLogoId;
						item.business = item.businessScope;
					});
					// if(result) this.tabscampny = res.data
					// else this.tabscampny = this.tabscampny.concat(res.data)
					this.tabscampny = this.tabscampny.concat(res.data);
				
					if (res.data.length == 0 || this.tabscampny.length == res.count || res.count == 0 || this.tabscampny.length == 0|| res.data.length<10) this.status = 'nomore';
					else this.status = 'loadmore';
					console.log(this.status);
				});
			}
		},
		init(){
			getCompanyList({
				page: this.currentPage,
				pageSize: 10
			}).then(res => {
				res.data.forEach(item => {
					item.icon = this.$imgUrl + item.companyLogoId;
					item.business = item.businessScope
				});
				 this.tabscampny = this.tabscampny.concat(res.data);
				if (res.data.length == 0 || this.tabscampny.length == res.count || res.count == 0 || this.tabscampny.length == 0 || res.data.length<10) this.status = 'nomore';
				else this.status = 'loadmore';
			});
		},
		change(index) {
			this.current = index;
			this.currentPage = 1;
			this.tabscampny = [];
			if(this.tabs[index].name == '全部'){
				this.init();
			}else{
				this.getCompanyList()
			}
		},
		toDetail(companyId) {
			if(uni.getStorageSync('userRole')==4){
				this.vipShow = true
				return
			}
			uni.navigateTo({
				url: 'showDetail/showDetail?id=' + companyId
			});
		}
	}
};
</script>

<style lang="less" scoped>
.show_top {
	position: sticky;
	top: 0;
}
.show {
	padding: 0 30rpx;
}
.text_hidden {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
}
.text_hidden_1 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}
.show_item {
	padding: 40rpx 0;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: center;
	.show_item_right {
		flex: 1;
		display: flex;
		flex-direction: column;
		    justify-content: center;
		view:nth-child(1) {
			font-size: 32rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			margin-bottom: 20rpx;
			color: rgba(0, 0, 0, 0.85);
			overflow: hidden; //一定要写
			text-overflow: ellipsis; //超出省略号
			display: -webkit-box; //一定要写
			-webkit-line-clamp: 1; //控制行数
			-webkit-box-orient: vertical; //一定要写
		}
		view:nth-child(2) {
			font-size: 24rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #a6a6a6;
		}
		view:nth-child(3) {
			width: 152rpx;
			text-align: center;
			font-size: 24rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #00b386;
			padding: 4rpx 16rpx;
			background: rgba(0, 179, 134, 0.2);
			border-radius: 8rpx;
		}
	}
	image {
		width: 152rpx;
		height: 152rpx;
		margin-right: 24rpx;
	}
}
</style>
