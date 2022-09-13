<template>
	<view>
		<view class="" style="padding: 10px; 15px"><u-search placeholder="请输入文档名" @search="search" @custom="search" v-model="keyword"></u-search></view>
		<view class=""><u-swiper :list="list" height="376" @click="godetail"></u-swiper></view>
		<view class="" style="padding: 10px;">
			<u-tabs
				:list="list1"
				font-size="34"
				:active-item-style="{
					color: '#49C265',
					fontWeight: 'bold',
					transform: 'scale(1.15)'
				}"
				:bar-style="{
					backgroundColor: '#49C265'
				}"
				:is-scroll="true"
				:current="current"
				@change="change"
			></u-tabs>
		</view>
		<view class="pdfList_item" @click="toDetail(item)" v-for="(item, i) in pdfList" :key="i">
			<view class="pdfList_item_top">
				
				{{ item.title }}.pdf
				<text
					style="width: 26px;
							background: #49C265;
							border-radius: 2px;
							color:#fff;
							display:inline-block;
							margin-left: 10px;
							text-align: center;
							box-sizing: content-box;
							line-height: 15px;
							font-size: 10px;
							font-family: PingFang-SC-Regular, PingFang-SC;
							font-weight: 400;
							padding: 3px 6px;
							color: #FFFFFF;
							"
				>
					专题
				</text>
				
			</view>
			
			<view class="pdfList_item_bottom">
				<image src="../../static/index/pdfShow.png" mode=""></image>
				<text style="margin-left: 12rpx;">pdf</text>
				<text style="margin-left: 16rpx;">{{ item.fileSize }}</text>
				<text style="margin-left: 16rpx;">{{ item.totalPage }}页</text>
				<text style="margin-left: 16rpx;">{{ item.createTime | year_date }}</text>
			</view>
			<view
				class=""
				style="display: flex;align-items: center;font-size: 12px;
				font-family: PingFang-SC-Regular, PingFang-SC;
				font-weight: 400;
				color: #F5A623;
				line-height: 17px;"
			>
				<view
					class=""
					v-for="item in 3"
					:key="item"
					style="margin-right: 12px;display: center;flex-wrap: wrap;;align-items: center;height: 20px;background: rgba(245,166,35,0.2);border-radius: 4px;padding: 2px 12px;"
				>
					政务
				</view>
			</view>
		</view>

		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
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
import { getRecPDFList, getTypes, getPdfInfoList } from '../../common/request.js';
export default {
	data() {
		return {
			keyword: '',
			content: '该内容需要会员才能观看,请登录',
			vipShow: false,
			list: [],
			pdfList: [],
			list1: [],
			current: 0,
			status: '没有更多了',
			iconType: 'flower',
			loadText: {
				loadmore: '上拉或点击加载更多',
				loading: '努力加载中',
				nomore: '没有更多了'
			},
			typeId: '',
			currentPage: 1,
			isSearch: false,
			browsePermission: null
		};
	},
	onLoad() {
		this.getTypes();
		this.getRecPDFList();
	},
	onReachBottom() {
		this.currentPage = ++this.currentPage;
		this.status = 'loading';
		this.getPdfInfoList();
	},
	onPullDownRefresh() {
		this.currenPage = 1;
		this.pdfList = [];
		this.getTypes();
		this.getRecPDFList();

		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		confirmVip() {
			uni.navigateTo({
				url: '/pages/index/vipLogin/vipLogin'
			});
		},
		cancelVip() {},
		search() {
			uni.navigateTo({
				url: '../index/pdfList/pdfList?keyword=' + this.keyword
			});
		},
		godetail(index) {
			this.browsePermission = this.list[index].browsePermission;
			if (uni.getStorageSync('userRole') == 4 && item.browsePermission == 2) {
				this.vipShow = true;
				return;
			}
			let timestamp = Math.round(new Date() / 1000);
			if (timestamp - uni.getStorageSync('PDFsubMsg') >= 60 * 60) {
				wx.requestSubscribeMessage({
					tmplIds: ['UFE9-Ma7eyhyfScxZL6eMWosKAKcCHRpN6LmZMAEOBU'],
					success(res) {
						console.log(res);
						let timestamp = Math.round(new Date() / 1000);
						uni.setStorageSync('PDFsubMsg', timestamp);
					},
					fail(res) {
						console.log(res);
					}
				});
			}

			console.log(this.list);
			console.log(index);
			uni.navigateTo({
				url: '/pages/index/pdfList/pdfDetail/pdfDetail?id=' + this.list[index].pdfId
			});
		},
		toDetail(item) {
			if (uni.getStorageSync('userRole') == 4 && item.browsePermission == 2) {
				this.vipShow = true;
				return;
			}
			let timestamp = Math.round(new Date() / 1000);
			if (timestamp - uni.getStorageSync('subMsg') >= 21600) {
				wx.requestSubscribeMessage({
					tmplIds: ['UFE9-Ma7eyhyfScxZL6eMWosKAKcCHRpN6LmZMAEOBU'],
					success(res) {
						console.log(res);
						let timestamp = Math.round(new Date() / 1000);
						uni.setStorageSync('subMsg', timestamp);
					},
					fail(res) {
						console.log(res);
					}
				});
			}
			uni.navigateTo({
				url: '../index/pdfList/pdfDetail/pdfDetail?id=' + item.pdfId
			});
		},
		// 获取文章类别
		getTypes() {
			getTypes({
				typeGroup: 'PDF'
			}).then(res => {
				if (res.code == 0) {
					res.data.forEach(e => {
						e.name = e.typeName;
					});
					this.list1 = res.data;
					this.typeId = res.data[0].typeId;
					this.getPdfInfoList();
				}
			});
		},
		getRecPDFList() {
			getRecPDFList().then(res => {
				if (res.code == 0) {
					res.data.forEach(e => {
						e.image = this.$imgUrl + e.logoId;
					});
					this.list = res.data;
				}
			});
		},
		getPdfInfoList() {
			getPdfInfoList({
				typeId: this.typeId,
				page: this.currentPage
			}).then(res => {
				if (res.code == 0) {
					this.pdfList = this.pdfList.concat(res.data);
					if (this.pdfList.length == res.count || res.count == 0) this.status = 'nomore';
					else this.status = 'loadmore';
				}
			});
		},

		change(index) {
			this.currentPage = 1;
			this.pdfList = [];
			this.current = index;
			this.typeId = this.list1[index].typeId;
			this.getPdfInfoList();
		}
	}
};
</script>

<style lang="less" scoped>
.pdfList_item {
	padding: 32rpx;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.1) !important;
	margin-bottom: 20rpx;
	.pdfList_item_top {
		font-size: 30rpx;
		font-family: PingFang-SC-Medium, PingFang-SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.85);
		line-height: 42rpx;
	}
	.pdfList_item_bottom {
		display: flex;
		margin-bottom: 10px;
		align-items: center;
		margin-top: 22rpx;
		font-size: 24rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
		line-height: 34rpx;
		image:nth-child(1) {
			width: 24rpx;
			height: 28rpx;
		}
		image:nth-child(2) {
			width: 52rpx;
			height: 30rpx;
		}
	}
}
</style>
