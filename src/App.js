import React from 'react';
import logo from './logo.svg';
import './App.css';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            cart: {},
            total: 0.00
        };
    }

    importData = () => {
//         let request = new XMLHttpRequest();
//         request.open('GET', 'https://fruits.shub.club/fruits', true);
//         request.onload = function() {
//             let data = JSON.parse(request.response);
//             // console.log("req", request, data);
//             if (request.status >= 200 && request.status < 400) {
//                 // sessionStorage
//
//                 console.log(data);
//                 data.items.forEach(fruit => {
//                     console.log('fruit', fruit);
//                 });
//             } else {
//                 console.log("error loading fruits");
//             }
//         };
//         request.send();
//     }
        fetch('https://fruits.shub.club/fruits')
            .then(response => response.json())
            .then((data) => {
                // console.log(data);
                let items = {};
                data.items.forEach(i => {
                    console.log(i);
                    items[i.id] = i;
                });
                console.log(items);
                // this.setState({...this.state, items: data.items});
                this.setState({...this.state, items});
            })
            .catch(error => console.log(error));
    }

    modifyQuantity = (id, amount) => {
        let {cart, items, total} = this.state;
        if (id in cart) {
            const prev = cart[id];
            cart[id] += amount;
            if (cart[id] <= 0) {
                delete cart[id];
                total -= prev * items[id].price;
            } else {
                total += amount * items[id].price;
            }
        } else {
            cart[id] = amount;
            total += amount * items[id].price;
        }
        console.log(cart);
        this.setState({...this.state, cart, total});
    }

    componentDidMount() {
        this.importData();
    }


    render() {
        let {items, cart, total} = this.state;
        console.log(Object.values(items));
        return (
            <div className="App">
                <h1>Half Foods</h1>

                <table><tbody>
                {Object.values(items).map((i) => (
                    <tr>
                        <td><img src={i.image_src}/></td>
                        <td>{i.name}</td>
                        <td>${i.price.toFixed(2)}</td>
                        <td><button onClick={() => this.modifyQuantity(i.id, 1)}>+</button></td>
                        {/*<td><button>-</button></td>*/}
                    </tr>
                    ))}
                </tbody></table>

                <div id='sidebar'>
                    <h2>Cart</h2>
                    <table><tbody>
                        {Object.keys(cart).map((i) => {
                            if (Object.keys(items).includes(i)) {
                                const details = items[i];
                                return (
                                    <tr>
                                        <td>{details.name}</td>
                                        <td>{cart[i]}</td>
                                        <td><button onClick={() => this.modifyQuantity(details.id, -1)}>-</button></td>
                                    </tr>
                                )
                            } else {
                                delete cart[i];
                                this.setState({...this.state, cart});
                            }
                        }
                    )}
                    </tbody></table>
                    <div><b>Total:</b> ${parseFloat(total).toFixed(2)}</div>
                </div>
            </div>
        );
    }
}

export default App;
