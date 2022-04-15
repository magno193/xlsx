<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

async function download(type = 'SINGLE' || 'MULTIPLE') {
  type = type.toUpperCase();
  let response = null;
  let parameters = {};
  function setParameters(attrName, filename, error) {
    Object.assign(parameters, { attrName, filename, error });
  }
  switch (type) {
    case 'SINGLE':
      response = await api.downloadXLSX()
      setParameters('download', 'TEMPLATE.xlsx');
      break;
    case 'MULTIPLE':
      response = await api.downloadZIP();
      setParameters('download', 'TEMPLATE.zip');
      break;
    default:
      alert("WRONG PARAMETER FOR API");
      break;
  }
  if (response.blob) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(parameters.attrName, parameters.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
}

defineProps({ msg: String })

</script>

<template>
  <h1>{{ msg }}</h1>
  <div>
    <button @click="download('SINGLE')">XLSX</button>
    <form @submit.prevent="download('MULTIPLE')">
      <button>ZIP XLSX</button>
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
  font-weight: bold;
  color: #fff;
  background: #42b983;
  border: 2px solid #e9e9e9;
  margin: .5rem;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
}
</style>
