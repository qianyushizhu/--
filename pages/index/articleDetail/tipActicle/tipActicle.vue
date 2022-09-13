<template>
	<view>
		<view class="" style="height: 44px;background: rgba(73,194,101,0.2);display: flex;align-items: center;justify-content: center;font-size: 16px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #49C265;">
					{{title}}
				</view>
		<view style="padding: 20rpx 30rpx;">
			
		  <!-- articles -->
		  <view v-if="articleListDetail.length!==0">
		    <articles :articleListDetail="articleListDetail" ></articles>
				  <u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
		  </view>
		  <view  style="display: flex;justify-content: center;margin-top: 50rpx;" v-else>
		  	<image src="../../../../static/show/lj_icon_quesheng@2x.png" style="width: 80px;height: 60px;" mode=""></image>
		  </view>
		</view>
	</view>
	
</template>

<script>
	import {getTopicArticles} from '../../../../common/request.js'
	import articles from '@/component/articles.vue'
	export default {
		components: {
		  articles
		},
		data() {
			return {
			currenPage:1,
			topicId:'',
			articleListDetail:[],
			status: 'loadmore',
					iconType: 'flower',
					loadText: {
						loadmore: '',
						loading: '努力加载中',
						nomore: '没有更多数据'
					},
					title:''
			}
		},
		onLoad(opitons) {
			this.topicId = opitons.topicId
			this.title = opitons.title
			this.getTopicArticles()
		},
		methods: {
			getTopicArticles() {
			  getTopicArticles({
			    page:this.currenPage,
			    pageSize: 10,
			    topicId:this.topicId
			  }).then(res => {
						
						  this.articleListDetail = this.articleListDetail.concat(res.data)
						if(this.articleListDetail.length==res.count || res.count == 0) this.status = 'nomore'
						else this.status = 'loadmore'
			   
			  })
			}
		}
	}
</script>

<style>

</style>
