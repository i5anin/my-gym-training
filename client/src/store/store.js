import Vuex from 'vuex'
import EditorToolStore from '@/modules/editor-finance/store'
// import StorageToolStore from '@/modules/storage-tool/store'
// import IssueToolStore from '@/modules/issue-tool/store'

const store = new Vuex.Store({
  modules: { EditorToolStore },
})

export default store
