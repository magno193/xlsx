<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

async function getExcel() {
  const result = await (await api.getExcel()).json();
  console.log(result);
}

function alertMsg() {
  alert(count.value++)
}

defineProps({ msg: String })

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <div>
    <button @click="getExcel">GET DATA</button>
    <form @submit.prevent="alertMsg">
      <button>DOWNLOAD DATA</button>
    </form>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
button {
  color: #fff;
  background: #42b983;
  border: 4px solid #e9e9e9;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
}
</style>
