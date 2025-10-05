import type { Coffee } from './types';

export const coffeeMenu: Coffee[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Rich and bold single shot',
    price: '0.002',
    emoji: '☕',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Smooth espresso with steamed milk',
    price: '0.003',
    emoji: '🧋',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Latte',
    description: 'Creamy coffee with art on top',
    price: '0.0035',
    emoji: '🥛',
    image: 'https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Mocha',
    description: 'Chocolate-infused coffee delight',
    price: '0.004',
    emoji: '🍫',
    image: 'https://images.pexels.com/photos/1194430/pexels-photo-1194430.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Americano',
    description: 'Espresso with hot water',
    price: '0.0025',
    emoji: '💧',
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'Cold Brew',
    description: 'Smooth and refreshing cold coffee',
    price: '0.0045',
    emoji: '🧊',
    image: 'https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const renderMenu = (container: HTMLElement, onBuyClick: (coffee: Coffee) => void): void => {
  container.innerHTML = coffeeMenu.map(coffee => `
    <div class="menu-card" data-coffee-id="${coffee.id}">
      <div class="card-image-wrapper">
        <img src="${coffee.image}" alt="${coffee.name}" class="card-image" />
        <div class="card-overlay">
          <span class="card-emoji">${coffee.emoji}</span>
        </div>
      </div>
      <div class="card-content">
        <h3 class="card-title">${coffee.name}</h3>
        <p class="card-description">${coffee.description}</p>
        <div class="card-footer">
          <span class="card-price">${coffee.price} ETH</span>
          <button class="btn btn-buy" data-coffee-id="${coffee.id}">
            <span class="btn-icon">🛒</span>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-buy').forEach(button => {
    button.addEventListener('click', (e) => {
      const coffeeId = (e.currentTarget as HTMLElement).getAttribute('data-coffee-id');
      const coffee = coffeeMenu.find(c => c.id === coffeeId);
      if (coffee) {
        onBuyClick(coffee);
      }
    });
  });
};
