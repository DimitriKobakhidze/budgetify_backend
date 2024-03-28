const {
  searchArrayByName,
  sortArrayByIncome,
  genericErrorMsg,
} = require("../utils/utils");

exports.categories = (req, res) => {
  const { searchByCategoryName, sortByIncome } = req.query;

  try {
    let categories = req.user.categories;

    if (!categories.length)
      return res
        .status(204)
        .send({ msg: "You have not added any categories yet" });

    if (searchByCategoryName) {
      categories = searchArrayByName(
        categories,
        "categoryName",
        searchByCategoryName
      );
    }
    if (sortByIncome) {
      categories = sortArrayByIncome(categories, sortByIncome);
    }

    return res.status(200).send(categories);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: "An error occurred while processing your request." });
  }
};

exports.updateUserCategory = (req, res) => {
  const { currentCategoryName, newCategoryName } = req.body;

  try {
    const categoryObject = req.user.categories.find(
      (c) => c.categoryName === currentCategoryName
    );
    if (!categoryObject)
      return res.status(404).send({ msg: "Category not found" });

    categoryObject.categoryName = newCategoryName;
    req.user.save();
    return res.status(200).send({ msg: "Category updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};
exports.addUserCategory = (req, res) => {
  const { categoryName, isIncome } = req.body;
  try {
    const categoryObject = { categoryName, isIncome };

    req.user.categories.push(categoryObject);
    req.user.save();
    return res.status(200).send({ msg: "Category added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};
exports.deleteUserCategory = (req, res) => {
  const { categoryId } = req.body;
  try {
    req.user.categories = req.user.categories.filter(
      (c) => c._id.toString() !== categoryId
    );
    req.user.save();
    return res.status(200).send({ msg: "Category deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(genericErrorMsg);
  }
};
