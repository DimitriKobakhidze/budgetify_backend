exports.getCardById = (cardsArray, cardId) => {
  const selectedCard = cardsArray.find(
    (card) => card._id.toString() === cardId
  );

  return selectedCard;
};

exports.searchArrayByName = (items, propertyName, searchName) => {
  try {
    const searchedArray = items.filter((item) =>
      item[propertyName].toLowerCase().includes(searchName.toLowerCase())
    );

    return searchedArray;
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.sortArrayByIncome = (items, sortingBy) => {
  try {
    if (sortingBy === "income") {
      items.sort((a, b) =>
        a.isIncome === b.isIncome ? 0 : a.isIncome ? -1 : 1
      );
    } else if (sortingBy === "expenses") {
      items.sort((a, b) =>
        a.isIncome === b.isIncome ? 0 : a.isIncome ? 1 : -1
      );
    }

    return items;
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.genericErrorMsg = {
  msg: "An error occurred while processing your request.",
};
