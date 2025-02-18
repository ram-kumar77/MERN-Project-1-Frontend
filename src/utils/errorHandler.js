export const handleAxiosError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      return error.response.data.message || 'An error occurred';
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response from server';
    } else {
      // Something happened in setting up the request
      return 'Error setting up the request';
    }
  };