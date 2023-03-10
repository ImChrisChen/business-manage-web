<template>
  <el-form size="large" class="login-content-form" :rules="state.formRules" :model="state.formData">
    <el-form-item class="login-animation1" prop="userName">
      <el-input text :placeholder="$t('message.account.accountPlaceholder1')" v-model="state.formData.userName"
                clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input
          :type="state.isShowPassword ? 'text' : 'password'"
          :placeholder="$t('message.account.accountPlaceholder2')"
          v-model="state.formData.password"
          autocomplete="off"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock/>
          </el-icon>
        </template>
        <template #suffix>
          <i
              class="iconfont el-input__icon login-content-password"
              :class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
              @click="state.isShowPassword = !state.isShowPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3" prop="code">
      <el-col :span="15">
        <el-input
            text
            maxlength="4"
            :placeholder="$t('message.account.accountPlaceholder3')"
            v-model="state.formData.code"
            clearable
            autocomplete="off"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <ele-Position/>
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <el-button class="login-content-code" v-waves>1234</el-button>
      </el-col>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round v-waves @click="onSignIn"
                 :loading="state.loading.signIn">
        <span>{{ $t('message.account.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginAccount">
import {reactive, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ElMessage, FormRules} from 'element-plus';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {initFrontEndControlRoutes} from '/@/router/frontEnd';
import {initBackEndControlRoutes} from '/@/router/backEnd';
import {Session} from '/@/utils/storage';
import {formatAxis} from '/@/utils/formatTime'
import {NextLoading} from '/@/utils/loading'
import {useLoginApi} from "/@/api/login";
import {UserInfo} from "/@/interfaces";
import {useUserStore} from "/@/stores/user.store";

// ??????????????????
const {t} = useI18n();
const storesThemeConfig = useThemeConfig();
const {themeConfig} = storeToRefs(storesThemeConfig);
const route = useRoute();
const router = useRouter();
const state = reactive({
  isShowPassword: false,
    formRules: {
      userName: [
          {
              required: true,
              type: 'string',
              trigger: 'change',
              message: '?????????????????????'
          },
      ],
        password: [
            {
                required: true,
                type: 'string',
                trigger: 'change',
                message: '???????????????'
            }
        ],
        code: [
            {
                required: true,
                type: "string",
                trigger: 'change',
                message: '??????????????????',
            },
        ]
    } as FormRules,
  formData: {
    userName: 'admin',
    password: '123456',
    code: 1234,
  },
  loading: {
    signIn: false,
  },
});
const userStore = useUserStore()
// ????????????
const currentTime = computed(() => {
  return formatAxis(new Date());
});
// ??????
const onSignIn = async () => {
  state.loading.signIn = true

  const {signIn} = useLoginApi()
  const res = await signIn({
    username: state.formData.userName,
    password: state.formData.password
  }).finally(() => {
    state.loading.signIn = false
  })
  console.log('res:', res)
  if (res.code !== 0) {
    ElMessage.error('????????????????????????')
    return
  }
  const userInfo: UserInfo = res.data
  Session.set('token', userInfo.access_token)
  userStore.setUserInfo(userInfo)

  // ?????? token ??????????????????
  // Session.set('token', Math.random().toString(36).substr(0));
  // ?????????????????????????????????????????????????????????????????????????????????????????? `/src/stores/userInfo.ts` ?????????????????????????????????????????????
  // Cookies.set('userName', state.ruleForm.userName);
  if (!themeConfig.value.isRequestRoutes) {
    // ?????????????????????2????????????????????????
    const isNoPower = await initFrontEndControlRoutes();
    signInSuccess(isNoPower);
  } else {
    // ???????????????????????????isRequestRoutes ??? true??????????????????????????????
    // ????????????????????????????????? router ??????????????????????????? No match found for location with path "/"
    const isNoPower = await initBackEndControlRoutes();
    // ????????? initBackEndControlRoutes???????????? signInSuccess
    signInSuccess(isNoPower);
  }
};
// ????????????????????????
const signInSuccess = (isNoPower: boolean | undefined) => {
  if (isNoPower) {
    ElMessage.warning('??????????????????????????????');
    Session.clear();
  } else {
    // ????????????????????????????????????
    let currentTimeInfo = currentTime.value;
    // ??????????????????????????????
    // ??????????????????????????????????????????/???????????????????????????????????????????????????????????????
    if (route.query?.redirect) {
      router.push({
        path: <string>route.query?.redirect,
        query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
      });
    } else {
      router.push('/');
    }
    // ??????????????????
    const signInText = t('message.signInText');
    ElMessage.success(`${currentTimeInfo}???${signInText}`);
    // ?????? loading???????????????????????????????????????????????????
    NextLoading.start();
  }
  state.loading.signIn = false;
};
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>
