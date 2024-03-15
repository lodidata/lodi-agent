<template>
  <div class="table">
    <!-- 头部 -->
    <div class="table-head align-center">
      <div
        class="flex-1 flex-center text-center"
        v-for="(item, idx) in tableHead"
        :key="'tableHead' + idx"
      >
        {{ $t(item) }}
      </div>
    </div>

    <!-- 内容 -->
    <div class="table-body" v-if="tableBody.length">
      <slot name="table"></slot>
    </div>

    <!-- 内容为空 -->
    <div class="table-null flex-center" v-else>
      {{ $t('public.nullTxt') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    tableHead: {
      type: Array,
      default: () => []
    },
    tableBody: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang='scss'>
.table {
  color: #fff;
  &-head {
    background: #171633;
    font-size: 3.2vw;
    color: #9d9d9d;
    div {
      height: 10.666667vw;
      border-right: 0.266667vw solid #0e0d20;
      border-bottom: 0.266667vw solid #0e0d20;
      padding: 0 2.133333vw;
      &:last-child {
        border-right: 0;
      }
    }
  }
  &-body {
    font-size: 3.2vw;
    color: #fff;
    background: #1d1c3f;
    .table-cont {
      span {
        height: 9.066667vw;
        border-right: 0.266667vw solid #0e0d20;
        border-bottom: 0.266667vw solid #0e0d20;
        &:last-child {
          border-right: 0;
        }
      }
    }
  }
  &-null {
    background: #1d1c3f;
    color: #fff;
    font-size: 3.733333vw;
    height: 10.666667vw;
  }
}
</style>