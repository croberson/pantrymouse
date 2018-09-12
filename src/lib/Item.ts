export class Item {
    id:     number;
    name:   string;
    qty:    number;
}

export class DisplayItem {
    id:         number;
    category:   string;
    items:      Item[];
}
