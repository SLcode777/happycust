# HappyCust Integration Guide

## 🎯 Feedback Widget Integration

### Pour intégrer le widget de feedback sur ton site (AllyMeal, etc.)

#### Méthode simple : Script d'intégration (Recommandé)

Ajoute ce code **juste avant la balise `</body>`** de ton site :

```html
<!-- HappyCust Feedback Widget -->
<script>
  window.HappyCustConfig = {
    projectId: "TON_PROJECT_ID_ICI",        // ⚠️ Remplace par ton vrai project ID
    locale: "fr",                            // ou "en"
    happycustUrl: "https://happycust.com"    // URL de production
  };
</script>
<script src="https://happycust.com/widget.js"></script>
```

**Ce que ça fait automatiquement :**
- ✅ Crée un bouton flottant rond (💬) en bas à droite avec le gradient jaune-orange
- ✅ Ouvre une iframe avec bordure noire et style popover (comme sur la landing page)
- ✅ Même apparence sur tous les sites

#### Options de configuration

**Utiliser ton propre bouton personnalisé :**

```html
<script>
  window.HappyCustConfig = {
    projectId: "TON_PROJECT_ID",
    locale: "fr",
    customTrigger: true,  // ← Désactive le bouton par défaut
    happycustUrl: "https://happycust.com"
  };
</script>
<script src="https://happycust.com/widget.js"></script>

<!-- Ton propre bouton -->
<button onclick="window.HappyCust.open()">
  Support Client
</button>
```

**Contrôle programmatique :**

```javascript
// Ouvrir le widget
window.HappyCust.open();

// Fermer le widget
window.HappyCust.close();

// Toggle (ouvrir/fermer)
window.HappyCust.toggle();
```

#### Pour le développement local

```javascript
window.HappyCustConfig = {
  projectId: "cmg9tfp8i0003d8gktskxiay0",
  locale: "fr",
  happycustUrl: "http://localhost:3000"  // ← URL locale
};
```

---

## 📦 Reviews Widget Integration

Display your published customer reviews on your website with the HappyCust Reviews Widget.

---

## 🚀 Quick Start

### Option 1: React Component (Recommended)

Perfect for React/Next.js applications.

#### Installation

1. Copy the `ReviewsWidget` component to your project:
   - Copy `/src/components/reviews-widget/` folder to your project

2. Import and use:

```tsx
import { ReviewsWidget } from "@/components/reviews-widget"

export default function MyPage() {
  return (
    <div>
      <h1>What Our Customers Say</h1>
      <ReviewsWidget
        projectId="your-api-key-here"
        layout="grid"
        limit={6}
      />
    </div>
  )
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `projectId` | `string` | *required* | Your HappyCust API key |
| `layout` | `"grid"` \| `"carousel"` \| `"list"` | `"grid"` | Display layout |
| `limit` | `number` | `undefined` | Max number of reviews to show |
| `className` | `string` | `""` | Additional CSS classes |

#### Layout Examples

**Grid Layout** (3 columns on desktop):
```tsx
<ReviewsWidget
  projectId="your-api-key"
  layout="grid"
  limit={9}
/>
```

**Carousel Layout** (one review at a time with navigation):
```tsx
<ReviewsWidget
  projectId="your-api-key"
  layout="carousel"
/>
```

**List Layout** (vertical stack):
```tsx
<ReviewsWidget
  projectId="your-api-key"
  layout="list"
  limit={5}
/>
```

---

### Option 2: Direct API Access

For custom implementations or non-React frameworks.

#### Endpoint

```
GET https://your-happycust-domain.com/api/public/reviews?projectId={YOUR_API_KEY}
```

#### Query Parameters

- `projectId` (required): Your HappyCust API key
- `limit` (optional): Maximum number of reviews to return

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "clxyz123",
      "rating": 5,
      "content": "Amazing product! Highly recommend.",
      "name": "John Doe",
      "socialMediaProfile": "https://twitter.com/johndoe",
      "createdAt": "2025-10-02T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### Vanilla JavaScript Example

```html
<div id="reviews-container"></div>

<script>
  fetch('https://your-happycust-domain.com/api/public/reviews?projectId=YOUR_API_KEY&limit=6')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const container = document.getElementById('reviews-container')
        data.data.forEach(review => {
          const card = document.createElement('div')
          card.className = 'review-card'
          card.innerHTML = `
            <div class="rating">${'⭐'.repeat(review.rating)}</div>
            <p>${review.content}</p>
            <strong>${review.name || 'Anonymous'}</strong>
          `
          container.appendChild(card)
        })
      }
    })
</script>
```

#### jQuery Example

```javascript
$.getJSON('https://your-happycust-domain.com/api/public/reviews?projectId=YOUR_API_KEY', function(data) {
  if (data.success) {
    data.data.forEach(function(review) {
      $('#reviews-container').append(`
        <div class="review">
          <h3>${review.name}</h3>
          <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
          <p>${review.content}</p>
        </div>
      `)
    })
  }
})
```

---

## 🎨 Customization

### Styling the React Component

The `ReviewsWidget` uses Tailwind CSS classes. You can customize by:

1. **Override with className**:
```tsx
<ReviewsWidget
  projectId="your-api-key"
  className="max-w-6xl mx-auto"
/>
```

2. **Modify the component** directly in `reviews-widget.tsx` to match your brand colors

### Custom Styling for API Approach

```css
.review-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.rating {
  color: #fbbf24;
  font-size: 20px;
  margin-bottom: 12px;
}
```

---

## 🔐 Security & Privacy

- ✅ Only **published** reviews are shown
- ✅ Only reviews with **marketing consent** are included
- ✅ Email addresses are **never** exposed
- ✅ API is **read-only** (no POST/PUT/DELETE)

---

## 📝 Notes

- Reviews are fetched on component mount
- No authentication required (public API)
- CORS enabled for cross-origin requests
- Reviews are sorted by newest first

---

## 🆘 Support

Need help? Contact HappyCust support or check the documentation at your HappyCust admin dashboard.
