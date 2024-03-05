import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { status } from "@/services/MainService";

export const useMainStore = defineStore("main", () => {
  const apiStatus = ref("");

  const getStatus = async () => {
    try {
      const response = await status();
      apiStatus.value = response;
    } catch (error) {
      console.error(error);
      apiStatus.value = "offline";
    } finally {
      setTimeout(getStatus, 60000);
    }
  };

  getStatus();
  return { apiStatus };
});
