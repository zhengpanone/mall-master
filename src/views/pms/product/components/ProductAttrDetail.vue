<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性类型：">
        <el-select v-model="value.productAttributeCategoryId" placeholder="请选择属性类型" @change="handleProductAttrChange">
          <el-option v-for="item in productAttributeCategoryOptions" :key="item.value" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr, idx) in selectProductAttr">
            {{ productAttr.name }}：
            <el-checkbox-group v-if="productAttr.handAddStatus === 0" v-model="selectProductAttr[idx].values">
              <el-checkbox v-for="item in getInputListArr(productAttr.inputList)" :label="item" :key="item"
                class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div v-for="(item, index) in selectProductAttr[idx].options" style="display: inline-block"
                  class="littleMarginLeft">
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx, index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
              <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px" :data="value.skuStockList" border>
          <el-table-column v-for="(item, index) in selectProductAttr" :label="item.name" :key="item.id" align="center">
            <template v-slot="scope">
              {{ getProductSkuSp(scope.row, index) }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" width="80" align="center">
            <template v-slot="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="80" align="center">
            <template v-slot="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存预警值" width="80" align="center">
            <template v-slot="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="SKU编号" align="center">
            <template v-slot="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template v-slot="scope">
              <el-button type="text" @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList">刷新列表
        </el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPrice">同步价格
        </el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuStock">同步库存
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, index) in selectProductAttrPics">
            <span>{{ item.name }}:</span>
            <single-upload v-model="item.pic"
              style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, index) in selectProductParam" :class="{ littleMarginTop: index !== 0 }">
            <div class="paramInputLabel">{{ item.name }}:</div>
            <el-select v-if="item.inputType === 1" class="paramInput" v-model="selectProductParam[index].value">
              <el-option v-for="item in getParamInputList(item.inputList)" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectProductParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { fetchList as fetchProductAttrCateList } from '@/api/pms/productAttrCate';
import { fetchList as fetchProductAttrList } from '@/api/pms/productAttr';
import SingleUpload from '@/components/Upload/singleUpload.vue';
import MultiUpload from '@/components/Upload/multiUpload.vue';
import Tinymce from '@/components/Tinymce.vue';

const props = defineProps({
  value: Object,
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['prevStep', 'nextStep']);

const hasEditCreated = ref(false);
const productAttributeCategoryOptions = ref([]);
const selectProductAttr = ref([]);
const selectProductParam = ref([]);
const selectProductAttrPics = ref([]);
const addProductAttrValue = ref('');
const activeHtmlName = ref('pc');

const hasAttrPic = computed(() => {
  return selectProductAttrPics.value.length > 0;
});

const productId = computed(() => {
  return props.value?.id;
});

const selectProductPics = computed({
  get() {
    let pics = [];
    if (!props.value.pic) {
      return pics;
    }
    pics.push(props.value.pic);
    if (props.value.albumPics) {
      pics.push(...props.value.albumPics.split(','));
    }
    return pics;
  },
  set(newValue) {
    if (!newValue || newValue.length === 0) {
      props.value.pic = null;
      props.value.albumPics = null;
    } else {
      props.value.pic = newValue[0];
      props.value.albumPics = newValue.slice(1).join(',');
    }
  }
});

const getProductSkuSp = (row: any, index: any) => {
  let spData = JSON.parse(row.spData);
  if (spData != null && index < spData.length) {
    return spData[index].value;
  } else {
    return null;
  }
}
const getProductAttrCateList = async () => {
  const param = { pageNum: 1, pageSize: 100 };
  const response = await fetchProductAttrCateList(param);
  productAttributeCategoryOptions.value = response.data.list.map(item => ({
    label: item.name,
    value: item.id
  }));
};

const getProductAttrList = async (type, cid) => {
  const param = { pageNum: 1, pageSize: 100, type };
  const response = await fetchProductAttrList(cid, param);
  const list = response.data.list;

  if (type === 0) {
    selectProductAttr.value = list.map(item => {
      const options = props.isEdit && item.handAddStatus === 1 ? getEditAttrOptions(item.id) : [];
      const values = props.isEdit ? getEditAttrValues(list.indexOf(item)) : [];
      return {
        id: item.id,
        name: item.name,
        handAddStatus: item.handAddStatus,
        inputList: item.inputList,
        values,
        options
      };
    });

    if (props.isEdit) {
      refreshProductAttrPics();
    }
  } else {
    selectProductParam.value = list.map(item => ({
      id: item.id,
      name: item.name,
      value: props.isEdit ? getEditParamValue(item.id) : null,
      inputType: item.inputType,
      inputList: item.inputList
    }));
  }
};

const handleProductAttrChange = value => {
  getProductAttrList(0, value);
  getProductAttrList(1, value);
};

const handleAddProductAttrValue = idx => {
  const options = selectProductAttr.value[idx].options;
  if (!addProductAttrValue.value) {
    return;
  }
  if (options.includes(addProductAttrValue.value)) {
    return;
  }
  selectProductAttr.value[idx].options.push(addProductAttrValue.value);
  addProductAttrValue.value = '';
};

const handleRemoveProductAttrValue = (idx, index) => {
  selectProductAttr.value[idx].options.splice(index, 1);
};

const handleEditCreated = () => {
  if (props.value.productAttributeCategoryId != null) {
    handleProductAttrChange(props.value.productAttributeCategoryId);
  }
  hasEditCreated.value = true;
};

const getEditAttrOptions = id => {
  const options = [];
  for (const attrValue of props.value.productAttributeValueList) {
    if (attrValue.productAttributeId === id) {
      options.push(...attrValue.value.split(','));
      break;
    }
  }
  return options;
};

const getEditAttrValues = index => {
  const values = new Set();
  for (const sku of props.value.skuStockList) {
    const spData = JSON.parse(sku.spData);
    if (spData && spData.length > index) {
      values.add(spData[index].value);
    }
  }
  return Array.from(values);
};

const getEditParamValue = id => {
  const attrValue = props.value.productAttributeValueList.find(attr => attr.productAttributeId === id);
  return attrValue ? attrValue.value : null;
};

const refreshProductSkuList = () => {
  props.value.skuStockList = [];
  const skuList = props.value.skuStockList;

  const refreshSku = (spData) => {
    skuList.push({
      spData: JSON.stringify(spData)
    });
  };

  if (selectProductAttr.value.length === 1) {
    const attr = selectProductAttr.value[0];
    attr.values.forEach(value => refreshSku([{ key: attr.name, value }]));
  } else if (selectProductAttr.value.length === 2) {
    const [attr0, attr1] = selectProductAttr.value;
    attr0.values.forEach(value0 => {
      if (attr1.values.length === 0) {
        refreshSku([{ key: attr0.name, value: value0 }]);
      } else {
        attr1.values.forEach(value1 => refreshSku([{ key: attr0.name, value: value0 }, { key: attr1.name, value: value1 }]));
      }
    });
  } else if (selectProductAttr.value.length === 3) {
    const [attr0, attr1, attr2] = selectProductAttr.value;
    attr0.values.forEach(value0 => {
      if (attr1.values.length === 0) {
        refreshSku([{ key: attr0.name, value: value0 }]);
      } else {
        attr1.values.forEach(value1 => {
          if (attr2.values.length === 0) {
            refreshSku([{ key: attr0.name, value: value0 }, { key: attr1.name, value: value1 }]);
          } else {
            attr2.values.forEach(value2 => refreshSku([{ key: attr0.name, value: value0 }, { key: attr1.name, value: value1 }, { key: attr2.name, value: value2 }]));
          }
        });
      }
    });
  }
};

const refreshProductAttrPics = () => {
  selectProductAttrPics.value = [];
  if (selectProductAttr.value.length >= 1) {
    const values = selectProductAttr.value[0].values;
    values.forEach(value => {
      selectProductAttrPics.value.push({ name: value, pic: props.isEdit ? getProductSkuPic(value) : null });
    });
  }
};

const mergeProductAttrValue = () => {
  props.value.productAttributeValueList = [];
  selectProductAttr.value.forEach(attr => {
    if (attr.handAddStatus === 1 && attr.options && attr.options.length > 0) {
      props.value.productAttributeValueList.push({
        productAttributeId: attr.id,
        value: attr.options.join(',')
      });
    }
  });
  selectProductParam.value.forEach(param => {
    props.value.productAttributeValueList.push({
      productAttributeId: param.id,
      value: param.value
    });
  });
};

const mergeProductAttrPics = () => {
  selectProductAttrPics.value.forEach(pic => {
    props.value.skuStockList.forEach(sku => {
      const spData = JSON.parse(sku.spData);
      if (spData[0].value === pic.name) {
        sku.pic = pic.pic;
      }
    });
  });
};

const handlePrev = () => {
  emit('prevStep');
};

const handleNext = () => {
  mergeProductAttrValue();
  mergeProductAttrPics();
  emit('nextStep');
};

watch(productId, (newValue) => {
  if (!props.isEdit || hasEditCreated.value || !newValue || newValue === 0) return;
  handleEditCreated();
});

onMounted(() => {
  getProductAttrCateList();
});
</script>


<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px
}

.cardBg {
  background: #F8F9FC;
}
</style>
