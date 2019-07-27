const request = require('./request')


export const uploadTravelPicture = (filePath): Promise => {
    const formData = new FormData();
    formData.append('picture', {uri: filePath, name: 'picture', type: 'image/jpg'});

     return request.post({
         path: `/upload/picture`,
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
     })
}