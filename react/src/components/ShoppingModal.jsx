//モーダル表示

//一覧の商品情報を受け取る
function ShoppingModal({ items, closeModal }) {
     return (
        <div>

            <h2>購入状況確認</h2>

            {items.map((item) => (
                <div key={item.shoppingItemId}>

                    <span>
                        {item.itemName}
                    </span>

                    <input
                        type="checkbox"
                        checked={item.isBought === 1}
                        readOnly
                    />
                </div>
            ))}

            <button onClick={closeModal}>閉じる</button>

        </div>
     );
}

export default ShoppingModal;