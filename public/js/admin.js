const deleteProduct = (btn) => {
  const parent = btn.parentNode;
  const productId = parent.children[2].value;
  const csrf = parent.children[3].value;
  // console.log("Product id : ", productId);
  // console.log("csrf : ", csrf);
  fetch("/admin/delete-product/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((res) => {
      console.log(res);
      deleteElementParent(parent);
    })
    .catch((err) => console.log(err));
};
const deleteElementParent = (element) => {
  // console.log(element.parentNode);
  element.parentNode.remove();
};
