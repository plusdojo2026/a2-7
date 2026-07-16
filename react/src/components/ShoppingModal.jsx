//モーダル表示
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
                        type=""
            ))}
        </div>
     )
}