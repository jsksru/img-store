module.exports = {
  port: 3000,
  prefix: '/api/v1',
  secret: '6021a76a99ca4d1d5a467de712ccf6875b91da1c2c5aa98b714012cbacc95a8c15d9feec2283b39b6f826a16c042e3768f5cc9bf2a790386028b1e103e1c2d6e',
  uploadDir: 'uploads',
  allowTypes: ['image/jpeg', 'image/png'],
  maxSize: 5000000,
  dimensions: [
    {
      fileName: 'thumb',
      maxWidth: 50,
      maxHeight: 50,
    },
    {
      fileName: 'small',
      maxWidth: 150,
      maxHeight: 150,
    },
    {
      fileName: 'medium',
      maxWidth: 500,
      maxHeight: 500,
    }
  ]
};