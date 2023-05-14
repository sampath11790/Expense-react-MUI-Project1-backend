const UpdateBucketDate = async (user, Location) => {
  console.log(user, Location);
  try {
    const buket = await user.createBucketdata({ Location: Location });
    console.log(buket);
    const allLocation = await user.getBucketdatas();
    console.log("allLocation", allLocation);
    return allLocation;
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = UpdateBucketDate;
