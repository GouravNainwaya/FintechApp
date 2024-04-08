function Node(data){
    this.data = data;
    this.next = null
}

let LinkedList = {
    head: null,

    append: (data) => {
        let newNode = new Node(data);

        if (this.head) {
            this.head  = newNode
            return
        }

        let current = this.head 
        while (current.next != null) {
            
        }
    }
}