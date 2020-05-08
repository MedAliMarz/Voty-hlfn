import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor() { }
  questions= [
    {
      question:'What is Blockchain in simple terms?',
      answer:'Blockchain can be described as a data structure that holds transactional records and while ensuring security, transparency, and decentralization. You can also think of it as a chain or records stored in the forms of blocks which are controlled by no single authority'
    },
    {
      question:'What is the hyperledger?',
      answer:'Hyperledger is an open source collaborative effort created to advance cross-industry blockchain technologies. It is a global collaboration, hosted by The Linux Foundation'
    },
    {
      question:'What is hyperledger fabric ?',
      answer:'Hyperledger Fabric is a modular blockchain framework that acts as a foundation for developing blockchain-based products, solutions, and applications using plug-and-play components that are aimed for use within private enterprises'
    },
    {
      question:'What is Blockchain in simple terms?',
      answer:''
    },
    {
      question:'What is Blockchain in simple terms?',
      answer:''
    },
  ]
  ngOnInit(): void {
  }

}
