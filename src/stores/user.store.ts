import { defineStore } from 'pinia';
import { UserInfo } from '/@/interfaces';

export const useUserStore = defineStore('user', {
	state: () => ({
		userInfo: {} as UserInfo,
	}),
	actions: {
		setUserInfo(v: any) {
			this.userInfo = v;
		},
	},
});
