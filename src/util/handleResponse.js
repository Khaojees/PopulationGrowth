
export const handleResponse = {
  success: (res) => {
    return {
      status: res.status,
      data: res.data,
    }
  },
  error: (res)=> {
    if (res.message === 'Network Error') {
      return {
        status: 500,
        error: res,
      }
    } else {
      return {
        status: res.response.status,
        error: res.response.data,
      }
    }
  },
}
