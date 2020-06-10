const errors = {
  errors: {
    badData: { status: 400, message: 'Bad data' },
    storage: { status: 400, message: 'Can\'t find storage' },
    negativeBalance: { status: 403, message: 'Negative balance is Not allowed' },
    cantWrite: { status: 400, message: 'Can\'t write a file' },
    cantFind: { status: 404, message: 'Can\'t find a file' },
  },
  status: {
    inited: { status: 200, message: 'Memory file has been inited' },
    added: { status: 200, message: 'Tranaction was sucessfully added' },
  },
};

module.exports = errors;
