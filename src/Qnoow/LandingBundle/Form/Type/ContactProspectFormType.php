<?php

namespace Qnoow\LandingBundle\Form\Type;

use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContactProspectFormType extends ProspectFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $builder->add('name', null,  array(
            'label' => 'landing.contact.name'
        ));
        $builder->add('text', TextareaType::class,  array(
            'label' => 'landing.contact.text'
        ));
        $builder->add('send', SubmitType::class, array(
            'label' => 'landing.contact.send',
            'attr' => array('class' => 'nek-button default')
        ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'Qnoow\LandingBundle\Entity\ContactProspect',
            )
        );
    }

    public function getName()
    {
        return 'qnoow_contact_prospect';
    }

}