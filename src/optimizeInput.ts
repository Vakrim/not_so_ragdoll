  const trainableInput = tf.variable(tf.tensor2d([results[0].input]));

  const optimizer2 = tf.train.sgd(0.00001);

  for (let i = 0; i < 100; i++) {
    optimizer2.minimize(
      () => {
        return (model.predict(trainableInput) as tf.Tensor2D).asScalar();
      },
      false,
      [trainableInput]
    );
  }

  console.log((model.predict(trainableInput) as tf.Tensor2D).asScalar().dataSync());
  console.log(trainableInput.dataSync());
