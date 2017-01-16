<?php

namespace Qnoow\LandingBundle\Form\Type;

use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EnterpriseProspectFormType extends ProspectFormType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $builder->add('name', null,  array(
            'label' => 'landing.enterprise_contact.name'
        ));
        $builder->add('telephoneNumber', null, array(
            'label' => 'landing.enterprise_contact.telephone_number'
        ));
        $builder->add('send', SubmitType::class, array(
            'label' => 'landing.enterprise_contact.send',
            'attr' => array('class' => 'nek-button default')
        ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'Qnoow\LandingBundle\Entity\EnterpriseProspect',
            )
        );
    }

    public function getName()
    {
        return 'qnoow_enterprise_user_prospect';
    }

}