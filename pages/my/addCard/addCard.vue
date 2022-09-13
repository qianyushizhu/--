<template>
	<view style="padding: 30rpx;box-sizing: border-box;">
		<u-form :model="form" ref="uForm" label-width="120">
			<u-form-item label="照片">
				<u-upload
					:file-list="fileList"
					@on-remove="onRemove"
					action="https://up-z2.qiniup.com"
					@on-success="onSuccess"
					:form-data="uploadData"
					:before-upload="beforeUpload"
					:max-count="1"
				></u-upload>
			</u-form-item>
			<u-form-item label="公司图片(尺寸:56x56)" >
				<u-upload
					:file-list="fileList2"
					@on-remove="onRemove2"
					action="https://up-z2.qiniup.com"
					@on-success="onSuccess2"
					:form-data="uploadData2"
					:before-upload="beforeUpload2"
					:max-count="1"
				></u-upload>
			</u-form-item>
			<u-form-item label="姓名"><u-input placeholder="请输入姓名" v-model="form.name" /></u-form-item>
			<u-form-item label="职位"><u-input placeholder="请输入职位" v-model="form.job" /></u-form-item>
			<u-form-item label="邮箱"><u-input placeholder="请输入邮箱" v-model="form.email" /></u-form-item>
			<u-form-item label="手机号"><u-input placeholder="请输入手机号" v-model="form.phone" /></u-form-item>
			<u-form-item label="所属公司"><u-input placeholder="请输入所属公司" v-model="form.company" /></u-form-item>
			<u-form-item label="公司地址"><u-input placeholder="请输入公司地址" v-model="form.location" /></u-form-item>
		</u-form>
		<view style="display: flex;justify-content: center;width: 100%;margin-top: 80rpx;" @click="comfirm"><view class="shenqingbutton">生成名片</view></view>
	</view>
</template>

<script>
import { createCard, getUploadToken,modifyCard } from '../../../common/request.js';
export default {
	data() {
		return {
			form: {
				logoId: '',
				name: '',
				job: '',
				email: '',
				company: '',
				location: '',
				phone: '',
				companyLogoId:"",
			},
			cardId:'',
			fileList: [],
			fileList2: [],
			uploadData: {
				key: '',
				token: ''
			},
			uploadData2: {
				key: '',
				token: ''
			},
			addOrEdit:false,
			
		};
	},
	onLoad(opitons) {
		if(opitons.info){
			this.addOrEdit = true
			let info = JSON.parse(opitons.info)
			console.log(info)
			this.form.name = info.userName
			this.form.phone = info.tel
			this.form.location = info.companyAddress
			this.form.email = info.email
			this.form.job = info.postInfo
			this.form.company = info.companyName
			this.cardId = info.cardId
			this.fileList.push({
				url: info.headLogo
			})
			this.fileList2.push({
				url:info.companyLogoId
			})
			this.form.logoId = info.headLogo.split('cn/')[1]
			this.form.companyLogoId = info.companyLogoId.split('cn/')[1]
		}else{
			
			this.addOrEdit = false
		}
	},
	methods: {
		comfirm() {
			console.log(this.form)
			for (let i in this.form) {
				if (this.form[i] == '') {
					
						uni.showToast({
							icon: 'error',
							title: '请填写完整'
						});
						return;
					}
					
			}
			if(this.addOrEdit){
				modifyCard({
					userName: this.form.name,
					postInfo: this.form.job,
					headLogo: this.form.logoId,
					tel: this.form.phone,
					email: this.form.email,
					companyAddress: this.form.location,
					companyName: this.form.company,
					companyLogoId: this.form.companyLogoId,
					cardId:this.cardId
				}).then(res => {
					if (res.code == 0) {
						uni.navigateBack({
							success: () => {
								delta: 1,
									uni.showToast({
										icon: 'success',
										title: '修改成功'
									});
									let page = getCurrentPages()
									let pre = page[page.length-1]
									pre.onLoad()
									console.log(pre)
							}
						});
					}
				});
			}else{
				createCard({
					userName: this.form.name,
					postInfo: this.form.job,
					headLogo: this.form.logoId,
					tel: this.form.phone,
					email: this.form.email,
					companyAddress: this.form.location,
					companyName: this.form.company,
					companyLogoId: this.form.companyLogoId,
				}).then(res => {
					if (res.code == 0) {
						uni.navigateBack({
							success: () => {
								delta: 1,
									uni.showToast({
										icon: 'success',
										title: '创建成功'
									});
									let page = getCurrentPages()
									let pre = page[page.length-1]
									pre.onLoad()
							}
						});
					}
				});
			}
			
		},
		onRemove(index, lists) {
			console.log('图片已被移除');
		},
		onSuccess(data, index, lists, name) {
			console.log(this.fileList, lists);
			this.form.logoId = lists[0].response.key;
		},
		async beforeUpload(index, list) {
			const res = await getUploadToken();
			this.uploadData.token = res.data.token;
			this.uploadData.key = res.data.fid;
		},
		onRemove2(index, lists) {
			console.log('图片已被移除');
		},
		onSuccess2(data, index, lists, name) {
			console.log(this.fileList2, lists);
			this.form.companyLogoId = lists[0].response.key;
		},
		async beforeUpload2(index, list) {
			const res = await getUploadToken();
			this.uploadData2.token = res.data.token;
			this.uploadData2.key = res.data.fid;
		}
	}
};
</script>

<style>
.u-form-item--left{
		width: 400rpx !important;
	}
	.u-form-item--left__content{
		width: 400rpx !important;
	}
.u-upload {
	justify-content: flex-end;
}
.u-input__input {
	text-align: end;
}
.shenqingbutton {
	color: #fff;
	width: 80%;
	height: 82rpx;
	line-height: 82rpx;
	background: linear-gradient(142deg, #588bfb 0%, #588afb 54%, #3396ff 100%);
	border-radius: 12rpx;
	text-align: center;
	font-size: 28rpx;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
}
</style>
