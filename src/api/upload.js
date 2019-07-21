const request = require('./request')


export const uploadTravelPicture = (filename, path): Promise => {
    const formData = new FormData();
    formData.append('picture', {uri: path, name: 'picture', type: 'image/jpg'});

     return request.post({
         path: `/upload/picture?filename=${filename}`,
         body: formData,
     })
}

