function Node(data) {
   return  {head: data, next: null}
}

let LinkedList = {
    head: null,

    // Function to insert a node at the end of the list
    append: function(data) {
        let newNode = new Node(data);
        console.log(this.head);
        if (!this.head) {
            this.head = newNode;
            return;
        }

        let current = this.head;
        while (current.next !== null) {
            current = current.next;
        }

        current.next = newNode;
    },

    // Function to display the linked list
    display: function() {
        let current = this.head;
        while (current !== null) {
            console.log(current.head);
            current = current.next;
        }
    }
};

LinkedList.append(10);
LinkedList.append(20);
LinkedList.append(30);
LinkedList.display(); // Output: 10 20 30
console.log(LinkedList);