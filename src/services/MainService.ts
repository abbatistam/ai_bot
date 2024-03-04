import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL);

// Endpoint para predecir una respuesta
export async function predict(question: string): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/predict`, { question });
    return response.data.result;
  } catch (error) {
    console.error(error);
    return "";
  }
}

// Endpoint para cargar un documento
export async function upload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.message;
  } catch (error) {
    console.error(error);
    return "";
  }
}

// Endpoint para obtener la lista de documentos
export async function listDocuments(): Promise<string[]> {
  try {
    const response = await axios.get(`${API_URL}/documents`);
    return response.data.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Endpoint para editar un documento
export async function editDocument(
  filename: string,
  content: string
): Promise<string> {
  try {
    const response = await axios.put(`${API_URL}/documents/${filename}`, {
      content,
    });
    return response.data.message;
  } catch (error) {
    console.error(error);
    return "";
  }
}

// Endpoint para eliminar un documento
export async function deleteDocument(filename: string): Promise<string> {
  try {
    const response = await axios.delete(`${API_URL}/documents/${filename}`);
    return response.data.message;
  } catch (error) {
    console.error(error);
    return "";
  }
}
