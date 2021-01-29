/**
 * api接口统一管理
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
import Vue from "vue"
import { get, post, del } from "./http"

export const noteSearch = (params) => get('/note/noteSearch',params)
export const noteSearchById = params => get(`/note/noteSearchById/${params}`)
export const componentSearch = (params) => get('/component/search',params)
export const photoSearch = (params) => get('/photos/search',params)
export const labelSearch = () => get('/label/search')


export const getInfoDetail = params => get('/event/tv/getInfoDetail.do',params)
export const getActivedAndRes = params => get('/event/tv/getActivedAndRes.do',params)
export const getActiveLiving = params => get('/event/tv/getActiveLiving.do',params)

export const tvLiveUrlsList = (params) => {
  get("/event/tv/getLiveUrls.do", params)
}
export const tvDetail = (params) =>
  get("/event/tv/selectEventInfo.do", params)
export const tvResourceDetail = (params) => get("event/tv/resourceDetail/selectDataInfo.do", params)

// export const getCode = (params) => get('event/tv/getQrCode.do',params)
export const getSearchList = (params) => get('event/tv/search/getResponse.do',params)
export const setMsg = (params) => get('event/tv/search/setMsg.do',params)
export const resSearch = (params) => get('event/tv/search.do',params)
export const getLoginToken = (params) => get('event/tv/login/getLoginToken.do',params)
export const getUser = () => get('/event/tv/selectUserInfoById.do')
export const login = (params) => post('https://ysclass.net/base-api/base/api/auth/loginByUserPwdNoOrg',params)
