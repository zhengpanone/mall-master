<template>
  <el-pagination
    v-model:current-page="props.page"
    v-model:page-size="props.limit"
    :page-sizes="[1, 2, 5, 10]"
    :total="listCount"
    :loadList="loadList"
    background
    layout="total,sizes,prev, pager, next,jumper"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>
<script lang="ts" setup>
interface PropsType {
  page: number;
  limit: number;
  listCount: number;
  loadList: () => void;
}
const props = withDefaults(defineProps<PropsType>(), {
  page: 1,
  limit: 1,
  listCount: 0,
  loadList: () => {},
});

/* const props = defineProps({
    page: { type: Number, defualt: 1 },
    limit: { type: Number, default: 1 },
    listCount: { type: Number, default: 0 },
    loadList: {
        type: Function,
        default: () => { }
    }
}) */
interface EmitsType {
  (e: "update:page", page: number): void;
  (e: "update:limit", limit: number): void;
}

const emit = defineEmits<EmitsType>();

// const emit = defineEmits(['update:page', 'update:limit'])
const handleCurrentChange = (page: number) => {
  emit("update:page", page);
  props.loadList();
};
const handleSizeChange = (size: number) => {
  emit("update:limit", size);
  emit("update:page", 1);
  props.loadList();
};
</script>
<style scoped></style>
